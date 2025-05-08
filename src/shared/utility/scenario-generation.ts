import { DateTime } from "luxon";
import { MAX_NUM_ENTRIES } from "shared/constants";
import { PaymentType, PaymentTypes } from "shared/models/payment-periods";
import { Scenario } from "shared/models/scenario";
import { ProjectedIncome, TimeSeries } from "shared/models/store/current";
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
import { groupBySingle } from "./group-by-single";
import { validateDateRanges } from "./validate-date-ranges";

/**
 * Interface defining important dates for a scenario
 *
 * @interface ScenarioDates
 * @property {DateTime} meritIncrease - Date when merit increases take effect
 * @property {DateTime} meritBonus - Date when merit bonuses are paid
 * @property {DateTime} companyBonus - Date when company bonuses are paid
 * @property {DateTime} retirement - Date when retirement bonuses are paid
 */
interface ScenarioDates {
  meritIncrease: DateTime;
  meritBonus: DateTime;
  companyBonus: DateTime;
  retirement: DateTime;
}

/**
 * Gets the relevant dates for a scenario based on projected income data
 * Falls back to default dates if actual dates aren't available
 *
 * @param {number} year - The year to get dates for
 * @param {ProjectedIncome} projectedIncome - Projected income data
 * @returns {ScenarioDates} Object containing all relevant dates for the scenario
 */
export const getScenarioDates = (year: number, projectedIncome: ProjectedIncome): ScenarioDates => {
  const defaultDates = getDefaultPayDates(year);
  return {
    meritIncrease: defaultDates.meritIncrease,
    meritBonus: getActualDate(year, projectedIncome.timeSeries.meritBonus) ?? defaultDates.meritBonus,
    companyBonus: getActualDate(year, projectedIncome.timeSeries.companyBonus) ?? defaultDates.companyBonus,
    retirement: getActualDate(year, projectedIncome.timeSeries.retirementBonus) ?? defaultDates.retirementBonus,
  };
};

/**
 * Gets company bonus factors for a given year from time series data
 *
 * @param {number} year - The year to get bonus factors for
 * @param {TimeSeries} timeSeries - Time series data containing bonus information
 * @returns {Array<{value: number, weight: number}>} Array of bonus factors and their weights
 */
const getCompanyBonusFactors = (year: number, timeSeries: TimeSeries) => {
  const companyBonusFactor = findSameYear(year, timeSeries.companyBonusPct);
  const companyBonusPcts = companyBonusFactor
    ? [companyBonusFactor.value]
    : timeSeries.companyBonusPct.slice(-1 * MAX_NUM_ENTRIES).map((x) => x.value);

  return Object.entries(Object.groupBy(companyBonusPcts, (x) => x)).map(([, values]) => ({
    weight: values!.length,
    value: values!.at(0)!,
  }));
};

/**
 * Builds merit scenarios for a given year from time series data and important dates
 *
 * @param {number} year - The year to build scenarios for
 * @param {TimeSeries} timeSeries - Time series data containing merit information
 * @param {ScenarioDates} dates - Important dates for the scenario
 * @returns {Partial<Scenario>[]} Array of merit scenarios
 */
const buildMeritScenarios = (year: number, timeSeries: TimeSeries, dates: ScenarioDates) => {
  const equityLookup = groupBySingle(
    timeSeries.meritPct?.map((x) => ({ date: x.date, value: x.equityPct })),
    (x) => DateTime.fromISO(x.date).year
  );
  const equityIncreasePct = findSameYear(year, timeSeries.meritPct)?.equityPct ?? 0;
  const pay = timeSeries.paycheck.filter((x) => {
    const date = DateTime.fromISO(x.date);
    return date.year > year - 3 && date.year <= year;
  });

  const mostRecentPay = pay.at(-1) ?? timeSeries.paycheck.at(-1);
  if (!mostRecentPay) {
    return [];
  }
  const actualMeritBonusPcts = pay.map((x) => findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritPct)?.meritBonusPct ?? 0);
  const meritSequence = getMeritSequence(year, timeSeries);

  if (meritSequence.length === 0) {
    return [getEmptyMeritSequence(year, timeSeries, pay)];
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

/**
 * Builds company bonus scenarios for a given year from time series data and base scenarios
 *
 * @param {number} year - The year to build scenarios for
 * @param {TimeSeries} timeSeries - Time series data containing bonus information
 * @param {Partial<Scenario>[]} baseScenarios - Base scenarios to apply company bonus factors to
 * @returns {Partial<Scenario>[]} Array of company bonus scenarios
 */
const buildCompanyBonusScenarios = (year: number, timeSeries: TimeSeries, baseScenarios: Partial<Scenario>[]) => {
  const companyBonusFactors = getCompanyBonusFactors(year, timeSeries);
  return baseScenarios.flatMap((scenario) => {
    return companyBonusFactors.map((companyBonusFactor) => {
      return { ...scenario, weight: scenario.weight! * companyBonusFactor.weight, companyBonusFactor: companyBonusFactor.value };
    });
  });
};

/**
 * Builds base scenarios with merit and company bonus factors
 *
 * @param {number} year - The year to build scenarios for
 * @param {TimeSeries} timeSeries - Time series data containing merit and bonus information
 * @param {ScenarioDates} dates - Important dates for the scenario
 * @returns {Partial<Scenario>[]} Array of base scenarios
 */
export const buildBaseScenarios = (year: number, timeSeries: TimeSeries, dates: ScenarioDates) => {
  const meritScenarios = buildMeritScenarios(year, timeSeries, dates);
  return buildCompanyBonusScenarios(year, timeSeries, meritScenarios);
};

/**
 * Applies bonuses to base scenarios to create final scenarios
 *
 * @param {Partial<Scenario>[]} baseScenarios - Base scenarios to apply bonuses to
 * @param {ScenarioDates} dates - Important dates for the scenarios
 * @param {Object} dateRanges - Date ranges for different types of income
 * @param {Object} paid - Already paid bonus amounts
 * @param {number} [paid.meritBonus] - Merit bonus amount if already paid
 * @param {number} [paid.companyBonus] - Company bonus amount if already paid
 * @param {number} [paid.retirementBonus] - Retirement bonus amount if already paid
 * @returns {Scenario[]} Array of complete scenarios with bonuses applied
 */
export const applyBonuses = (
  baseScenarios: Partial<Scenario>[],
  dates: ScenarioDates,
  dateRanges: ReturnType<typeof getEligibleIncomeDateRanges>,
  paid: { meritBonus?: number; companyBonus?: number; retirementBonus?: number }
) => {
  return baseScenarios.map((scenario) => {
    if (!scenario.payments) {
      throw new Error("Scenario payments is undefined");
    }
    if (scenario.lastThreeMeritBonusFactor === undefined) {
      throw new Error("Scenario lastThreeMeritBonusFactor is undefined");
    }
    if (scenario.meritBonusPct === undefined) {
      throw new Error("Scenario meritBonusPct is undefined");
    }
    if (scenario.year === undefined) {
      throw new Error("Scenario year is undefined");
    }

    validateDateRanges(dateRanges);

    const companyBonusPct = scenario.lastThreeMeritBonusFactor! * (scenario.companyBonusFactor ?? 0);
    const companyBonus =
      paid.companyBonus ?? Math.round(incomeByRange([PaymentTypes.regular], dateRanges.companyBonus, scenario.payments) * companyBonusPct);
    const meritBonus =
      paid.meritBonus ??
      Math.round(incomeByRange([PaymentTypes.regular], dateRanges.meritBonus, scenario.payments) * scenario.meritBonusPct!);

    const updatedPayments = scenario.payments.slice();

    const insertBonuses = (
      bonusType: PaymentType,
      bonusValue: number,
      bonusDate: DateTime,
      dateRange: { start: DateTime; end: DateTime }
    ) => {
      const payBeforeBonus = findNearestIdxOnOrBefore(bonusDate, updatedPayments, (x) => DateTime.fromISO(x.payedOn));
      updatedPayments.splice(payBeforeBonus + 1, 0, {
        type: bonusType,
        value: bonusValue,
        cumulative: 0,
        payedOn: bonusDate.toISO()!,
        start: dateRange.start.toISO()!,
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
      if (!prior) {
        return;
      }
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
};
