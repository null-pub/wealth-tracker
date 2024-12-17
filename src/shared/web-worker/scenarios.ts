import { DateTime } from "luxon";
import { MAX_NUM_ENTRIES } from "shared/constants";
import { PaymentPeriod, PaymentTypes } from "shared/models/payment-periods";
import { Scenario } from "shared/models/scenario";
import { AccountData, ProjectedIncome } from "shared/models/store/current";
import { getLocalDateTime } from "shared/utility/current-date";
import { findNearestIdxOnOrBefore } from "shared/utility/find-nearest-on-or-before";
import { findSameYear } from "shared/utility/find-same-year";
import { getPayments } from "shared/utility/get-payments";
import { valueByDateRange } from "shared/utility/get-values-by-date-range";
import { groupBySingle } from "shared/utility/group-by-single";
import { incomeByRange } from "shared/utility/income-by-range";
import { sumSimple } from "simple-statistics";
import { getEmptyMeritSequence, getMeritSequence } from "./merit-sequence";

const getRealDate = (year: number | undefined, data: AccountData[]) => {
  if (!year) {
    return undefined;
  }

  const entry = findSameYear(year, data);
  if (!entry) {
    return undefined;
  }

  return DateTime.fromISO(entry.date);
};

export const getScenarios = (year: number, projectedIncome: ProjectedIncome): Scenario[] => {
  const timeSeries = projectedIncome.timeSeries;
  const localDateTime = getLocalDateTime();
  const dates = {
    meritIncrease: DateTime.fromObject({ month: 4, day: 1, year }),
    meritBonus:
      getRealDate(year, projectedIncome.timeSeries.meritBonus) ?? DateTime.fromObject({ month: 4, day: 15, year }),
    companyBonus:
      getRealDate(year, projectedIncome.timeSeries.companyBonus) ?? DateTime.fromObject({ month: 6, day: 15, year }),
    retirement:
      getRealDate(year, projectedIncome.timeSeries.retirementBonus) ?? DateTime.fromObject({ month: 7, day: 15, year }),
  };

  const dateRanges = {
    base: {
      start: DateTime.fromObject({ month: 1, day: 1, year }),
      end: DateTime.fromObject({ month: 12, day: 31, year }).endOf("day"),
    },
    meritBonus: {
      start: DateTime.fromObject({ month: 1, day: 1, year: year - 1 }),
      end: DateTime.fromObject({ month: 12, day: 31, year: year - 1 }).endOf("day"),
    },
    companyBonus: {
      start: DateTime.fromObject({ day: 1, month: 4, year: year - 1 }),
      end: DateTime.fromObject({ day: 31, month: 3, year }).endOf("day"),
    },
    retirementBonus: {
      start: DateTime.fromObject({ day: 1, month: 7, year: year - 1 }),
      end: DateTime.fromObject({ day: 30, month: 6, year }).endOf("day"),
    },
  };

  const paid = {
    meritBonus: findSameYear(year, timeSeries.meritBonus)?.value,
    companyBonus: findSameYear(year, timeSeries.companyBonus)?.value,
    retirementBonus: findSameYear(year, timeSeries.retirementBonus)?.value,
  };

  const meritSequence = getMeritSequence(year, projectedIncome);

  const pay = timeSeries.paycheck.filter((x) => {
    const date = DateTime.fromISO(x.date);
    return date.year > year - 3 && date.year <= year;
  });

  const mostRecentPay = pay.at(-1) ?? timeSeries.paycheck.at(-1);
  if (!mostRecentPay) {
    return [];
  }

  const actualMeritBonusPcts = pay.map(
    (x) => findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct)?.value ?? 0
  );

  const equityLookup = groupBySingle(timeSeries.equityPct, (x) => DateTime.fromISO(x.date).year);

  const equityIncreasePct = findSameYear(year, timeSeries.equityPct)?.value ?? 0;
  const companyBonusFactor = findSameYear(year, timeSeries.companyBonusPct);
  const companyBonusPcts = companyBonusFactor
    ? [companyBonusFactor.value]
    : timeSeries.companyBonusPct.slice(-1 * MAX_NUM_ENTRIES).map((x) => x.value);

  const companyBonusPctWeights = Object.entries(Object.groupBy(companyBonusPcts, (x) => x)).map(([, values]) => {
    return {
      weight: values!.length,
      value: values!.at(0)!,
    };
  });

  const basePayAndMeritScenarios =
    meritSequence.length === 0
      ? getEmptyMeritSequence(year, projectedIncome, pay)
      : meritSequence.map(({ weight, values: merits }) => {
          const nextPay = pay.slice();
          const initial = nextPay.length;
          for (let i = initial; i < merits.length + initial; i++) {
            const prior = nextPay[i - 1] ?? mostRecentPay;
            const date = DateTime.fromISO(prior.date ?? mostRecentPay.date)
              .plus({ years: 1 })
              .set({ month: dates.meritIncrease.month, day: dates.meritIncrease.day });

            if (date.year > year) {
              break;
            }

            const equity = equityLookup[date.year]?.value ?? 0;
            nextPay.push({
              date: date.toISO()!,
              value: prior.value * (1 + merits[i - initial].meritIncreasePct + equity),
            });
          }

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
            valueByDateRange(nextPay)
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

  const postBasePay = basePayAndMeritScenarios.map((x) => {
    const aprToApr = (x.pay.at(-1)?.value ?? 0) * 26;
    const basePay = Math.round(incomeByRange([PaymentTypes.regular], dateRanges.base, x.payments));
    const meritBonus =
      paid.meritBonus ??
      Math.round(incomeByRange([PaymentTypes.regular], dateRanges.meritBonus, x.payments) * x.meritBonusPct);

    const payBeforeMerit = findNearestIdxOnOrBefore(dates.meritBonus, x.payments, (x) => DateTime.fromISO(x.payedOn));

    x.payments.splice(payBeforeMerit + 1, 0, {
      value: meritBonus,
      start: dateRanges.meritBonus.start.toISO()!,
      end: dateRanges.meritBonus.end.toISO()!,
      payedOn: dates.meritBonus.toISO()!,
      cumulative: 0,
      type: PaymentTypes.bonus,
    });

    return { ...x, aprToApr, basePay, meritBonus };
  });

  const withCompanyBonus = companyBonusPctWeights.flatMap((companyBonusFactor) => {
    return postBasePay.map((x) => {
      const companyBonusPct = x.lastThreeMeritBonusFactor * companyBonusFactor.value;
      const companyBonus =
        paid.companyBonus ??
        Math.round(incomeByRange([PaymentTypes.regular], dateRanges.companyBonus, x.payments) * companyBonusPct);

      const payBeforeCompanyBonus = findNearestIdxOnOrBefore(dates.companyBonus, x.payments, (x) =>
        DateTime.fromISO(x.payedOn)
      );

      const payments = x.payments.toSpliced(payBeforeCompanyBonus + 1, 0, {
        value: companyBonus,
        start: dateRanges.companyBonus.start.toISO()!,
        end: dateRanges.companyBonus.end.toISO()!,
        payedOn: dates.companyBonus.toISO()!,
        cumulative: 0,
        type: PaymentTypes.bonus,
      });

      const cumulative: PaymentPeriod[] = payments.filter((x) => DateTime.fromISO(x.payedOn).year < year);
      const baseLength = cumulative.length;
      payments
        .filter((x) => DateTime.fromISO(x.payedOn).year === year)
        .forEach((x, i) => {
          cumulative.push({ ...x, cumulative: i > 0 ? cumulative[i + baseLength - 1].cumulative + x.value : x.value });
        });

      return {
        ...x,
        weight: x.weight * companyBonusFactor.weight,
        companyBonusFactor: companyBonusFactor.value,
        companyBonusPct,
        companyBonus,
        payments: cumulative,
      };
    });
  });

  const totals = withCompanyBonus.map((x) => {
    const retirementBonus =
      paid.retirementBonus ??
      Math.round(
        incomeByRange([PaymentTypes.regular, PaymentTypes.bonus], dateRanges.retirementBonus, x.payments) * 0.15
      );
    const totalPay = Math.round(sumSimple([x.basePay, x.meritBonus, x.companyBonus, retirementBonus]));
    const taxablePay = Math.round(sumSimple([x.basePay, x.meritBonus, x.companyBonus]));

    const payBeforeRetirementBonus = findNearestIdxOnOrBefore(dates.retirement, x.payments, (x) =>
      DateTime.fromISO(x.payedOn)
    );
    x.payments.splice(payBeforeRetirementBonus + 1, 0, {
      value: retirementBonus,
      start: dateRanges.retirementBonus.start.toISO()!,
      end: dateRanges.retirementBonus.end.toISO()!,
      payedOn: dates.retirement.toISO()!,
      cumulative: 0,
      type: PaymentTypes.nonTaxableBonus,
    });

    const regularPayments =  x.payments.filter((x) => x.type === PaymentTypes.regular);
    const currentPaymentIdx = findNearestIdxOnOrBefore(localDateTime, regularPayments, (x) => DateTime.fromISO(x.payedOn));
    const remainingRegularPayments = regularPayments.length - currentPaymentIdx;

    return {
      currentPaymentIdx,
      remainingRegularPayments,
      totalPay,
      retirementBonus,
      taxablePay,
      ...x,
    };
  });

  return totals.sort((a, b) => {
    const weight = b.weight - a.weight;
    return weight === 0 ? b.totalPay - a.totalPay : weight;
  });
};
