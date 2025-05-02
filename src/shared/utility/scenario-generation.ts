import { DateTime } from "luxon";
import { MAX_NUM_ENTRIES } from "shared/constants";
import { PaymentType, PaymentTypes } from "shared/models/payment-periods";
import { Scenario } from "shared/models/scenario";
import { AccountData, ProjectedIncome } from "shared/models/store/current";
import { getLocalDateTime } from "shared/utility/current-date";
import { findNearestIdxOnOrBefore } from "shared/utility/find-nearest-on-or-before";
import { findSameYear } from "shared/utility/find-same-year";
import { getActualDate } from "shared/utility/get-actual-date";
import { getDefaultPayDates } from "shared/utility/get-default-pay-dates";
import { getEligibleIncomeDateRanges } from "shared/utility/get-eligible-income-date-ranges";
import { getFuturePay } from "shared/utility/get-future-pay";
import { getMeritSequence } from "shared/utility/get-merit-sequence";
import { getPayments } from "shared/utility/get-payments";
import { incomeByRange } from "shared/utility/income-by-range";
import { sumSimple } from "simple-statistics";
import { getEmptyMeritSequence } from "./get-empty-merit-sequence";
import { getValueByDateRange } from "./get-values-by-date-range";
import { isDefined } from "./is-defined";

interface ScenarioDates {
  meritIncrease: DateTime;
  meritBonus: DateTime;
  companyBonus: DateTime;
  retirement: DateTime;
}

export const getScenarioDates = (year: number, projectedIncome: ProjectedIncome): ScenarioDates => {
  const defaultDates = getDefaultPayDates(year);
  return {
    meritIncrease: defaultDates.meritIncrease,
    meritBonus: getActualDate(year, projectedIncome.timeSeries.meritBonus) ?? defaultDates.meritBonus,
    companyBonus: getActualDate(year, projectedIncome.timeSeries.companyBonus) ?? defaultDates.companyBonus,
    retirement: getActualDate(year, projectedIncome.timeSeries.retirementBonus) ?? defaultDates.retirementBonus,
  };
};

export const getCompanyBonusFactors = (year: number, timeSeries: ProjectedIncome["timeSeries"]) => {
  const companyBonusFactor = findSameYear(year, timeSeries.companyBonusPct);
  const companyBonusPcts = companyBonusFactor
    ? [companyBonusFactor.value]
    : timeSeries.companyBonusPct.slice(-1 * MAX_NUM_ENTRIES).map((x) => x.value);

  return Object.entries(Object.groupBy(companyBonusPcts, (x) => x)).map(([, values]) => ({
    weight: values!.length,
    value: values!.at(0)!,
  }));
};

export const buildBaseScenarios = (
  year: number,
  projectedIncome: ProjectedIncome,
  pay: AccountData[],
  mostRecentPay: AccountData,
  dates: ScenarioDates,
  equityLookup: Partial<Record<number, { date: string; value: number }>>
) => {
  const { timeSeries } = projectedIncome;
  const actualMeritBonusPcts = pay.map((x) => findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct)?.value ?? 0);
  const equityIncreasePct = findSameYear(year, timeSeries.equityPct)?.value ?? 0;
  const meritSequence = getMeritSequence(year, projectedIncome);

  if (meritSequence.length === 0) {
    return [getEmptyMeritSequence(year, projectedIncome, pay)];
  }

  return meritSequence.map(({ weight, values: merits }) => {
    const nextPay = getFuturePay(
      pay,
      mostRecentPay,
      merits.map((x) => x.meritIncreasePct),
      dates.meritIncrease,
      year,
      equityLookup
    );

    nextPay.forEach((x) => {
      x.value = Math.round(x.value);
    });

    const projectedMerit = merits.map((x) => x.meritBonusPct);
    const lastThreeMeritBonuses = actualMeritBonusPcts.concat(projectedMerit).slice(-3);
    const lastThreeMeritBonusFactor = sumSimple(lastThreeMeritBonuses);
    const lastMerit = merits.at(-1)!;

    const payments = getPayments(
      DateTime.fromObject({ day: 1, month: 1, year: year - 1 }),
      DateTime.fromObject({ day: 31, month: 12, year: year }).endOf("day"),
      getValueByDateRange(nextPay)
    );

    return {
      year,
      weight,
      pay: nextPay,
      lastThreeMeritBonusFactor,
      lastThreeMeritBonuses,
      meritBonusPct: lastMerit.meritBonusPct,
      meritIncreasePct: lastMerit.meritIncreasePct,
      payments,
      equityIncreasePct,
      retirementBonusPct: 0.15,
    };
  });
};

export const applyBonuses = (
  baseScenarios: Partial<Scenario>[],
  companyBonusFactors: Array<{ weight: number; value: number }>,
  dates: ScenarioDates,
  dateRanges: ReturnType<typeof getEligibleIncomeDateRanges>,
  paid: { meritBonus?: number; companyBonus?: number; retirementBonus?: number }
) => {
  return baseScenarios.flatMap((scenario) => {
    return companyBonusFactors.map((companyBonusFactor) => {
      if (!isDefined(scenario.payments)) {
        throw new Error("Scenario payments is undefined");
      }
      if (!isDefined(scenario.lastThreeMeritBonusFactor)) {
        throw new Error("Scenario lastThreeMeritBonusFactor is undefined");
      }
      if (!isDefined(scenario.meritBonusPct)) {
        throw new Error("Scenario meritBonusPct is undefined");
      }
      if (!isDefined(scenario.year)) {
        throw new Error("Scenario year is undefined");
      }

      const companyBonusPct = scenario.lastThreeMeritBonusFactor * companyBonusFactor.value;
      const companyBonus =
        paid.companyBonus ??
        Math.round(incomeByRange([PaymentTypes.regular], dateRanges.companyBonus, scenario.payments) * companyBonusPct);
      const meritBonus =
        paid.meritBonus ??
        Math.round(incomeByRange([PaymentTypes.regular], dateRanges.meritBonus, scenario.payments) * scenario.meritBonusPct);

      const updatedPayments = scenario.payments.slice();

      const insertBonuses = (
        bonusType: PaymentType,
        bonusValue: number,
        bonusDate: DateTime<true>,
        dateRange: { start: DateTime<true>; end: DateTime<true> }
      ) => {
        const payBeforeBonus = findNearestIdxOnOrBefore(bonusDate, updatedPayments, (x) => DateTime.fromISO(x.payedOn));
        updatedPayments.splice(payBeforeBonus + 1, 0, {
          type: bonusType,
          value: bonusValue,
          cumulative: 0,
          payedOn: bonusDate.toISO()!,
          start: dateRange.start.toISO(),
          end: dateRange.end.toISO()!,
        });
      };

      insertBonuses(PaymentTypes.bonus, meritBonus, dates.meritBonus, dateRanges.meritBonus);
      insertBonuses(PaymentTypes.bonus, companyBonus, dates.companyBonus, dateRanges.companyBonus);

      const retirementBonus =
        paid.retirementBonus ??
        Math.round(incomeByRange([PaymentTypes.regular, PaymentTypes.bonus], dateRanges.retirementBonus, updatedPayments) * 0.15);
      insertBonuses(PaymentTypes.nonTaxableBonus, retirementBonus, dates.retirement, dateRanges.retirementBonus);

      updatedPayments.forEach((current, i) => {
        const prior = updatedPayments[i - 1];
        if (DateTime.fromISO(current.payedOn).year === scenario.year && DateTime.fromISO(prior.payedOn).year === scenario.year) {
          if (current.type === PaymentTypes.bonus || current.type === PaymentTypes.regular) {
            current.cumulative = prior.cumulative + current.value;
          } else if (current.type === PaymentTypes.nonTaxableBonus) {
            current.cumulative = prior.cumulative;
          }
        }
      });

      const basePay = Math.round(incomeByRange([PaymentTypes.regular], dateRanges.base, updatedPayments));
      const aprToApr = (scenario.pay!.at(-1)?.value ?? 0) * 26;
      const taxablePay = basePay + meritBonus + companyBonus;
      const totalPay = taxablePay + retirementBonus;

      const currentPaymentIdx = findNearestIdxOnOrBefore(getLocalDateTime(), updatedPayments, (x) => DateTime.fromISO(x.payedOn));
      const remainingRegularPayments = updatedPayments.slice(currentPaymentIdx + 1).filter((x) => x.type === PaymentTypes.regular).length;

      return {
        ...scenario,
        weight: scenario.weight! * companyBonusFactor.weight,
        companyBonusFactor: companyBonusFactor.value,
        companyBonusPct,
        companyBonus,
        meritBonus,
        retirementBonus,
        payments: updatedPayments,
        basePay,
        aprToApr,
        taxablePay,
        totalPay,
        currentPaymentIdx,
        remainingRegularPayments,
      } as Scenario;
    });
  });
};
