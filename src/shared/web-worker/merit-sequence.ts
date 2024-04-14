import { DateTime } from "luxon";
import { AccountData, ProjectedIncome } from "shared/models/store/current";
import { findSameYear } from "shared/utility/find-same-year";
import { getPayments } from "shared/utility/get-payments";
import { valueByDateRange } from "shared/utility/get-values-by-date-range";

export const getScenarioSize = (year: number, projectedIncome: ProjectedIncome) => {
  const timeSeries = projectedIncome.timeSeries;
  const pay = timeSeries.paycheck.filter((x) => DateTime.fromISO(x.date).year > year - 3);
  const mostRecentPay = pay.at(-1) ?? timeSeries.paycheck.at(-1);
  if (!mostRecentPay) {
    return 0;
  }

  const yearsToGenerate = Math.max(year - DateTime.fromISO(mostRecentPay.date).year, 1);
  return Math.pow(timeSeries.meritIncreasePct.length, yearsToGenerate) * timeSeries.companyBonus.length;
};

export const getMeritPairs = (year: number, projectedIncome: ProjectedIncome) => {
  const timeSeries = projectedIncome.timeSeries;
  const meritBonusPct = findSameYear(year, timeSeries.meritBonusPct);
  const meritIncreasePct = findSameYear(year, timeSeries.meritIncreasePct);

  const allMeritPairs = timeSeries.meritIncreasePct.map((x) => {
    const meritBonusPctPair = findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct);
    return {
      meritIncreasePct: x.value,
      meritBonusPct: meritBonusPctPair?.value ?? 0,
    };
  });

  return allMeritPairs
    .filter((x) => (meritBonusPct ? x.meritBonusPct === meritBonusPct.value : true))
    .filter((x) => (meritIncreasePct ? x.meritIncreasePct === meritIncreasePct?.value : true));
};

export const getMeritSequence = (year: number, projectedIncome: ProjectedIncome) => {
  const timeSeries = projectedIncome.timeSeries;
  const meritPairs = getMeritPairs(year, projectedIncome);

  const pay = timeSeries.paycheck.filter((x) => DateTime.fromISO(x.date).year > year - 3);
  const mostRecentPay = pay.at(-1) ?? timeSeries.paycheck.at(-1);

  if (!mostRecentPay) {
    return [];
  }

  const yearsToGenerate = Math.max(year - DateTime.fromISO(mostRecentPay.date).year, 1);

  let meritSequence = meritPairs.slice().map((x) => [x]);
  for (let i = 0; i < yearsToGenerate - 1; i++) {
    meritSequence = meritSequence.flatMap((x) => {
      return meritPairs.map((merit) => {
        return x.slice().concat(merit);
      });
    });
  }
  return meritSequence;
};

export const getEmptyMeritSequence = (year: number, projectedIncome: ProjectedIncome, pay: AccountData[]) => {
  const timeSeries = projectedIncome.timeSeries;
  const equityIncreasePct = findSameYear(year, timeSeries.equityPct)?.value ?? 0;
  const meritIncreasePct = findSameYear(year, timeSeries.meritIncreasePct)?.value ?? 0;
  const meritBonusPct = findSameYear(year, timeSeries.meritBonusPct)?.value ?? 0;
  const meritBonuses = pay.map(
    (x) => findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct)?.value ?? 0
  );

  const lastThreeMeritBonuses = meritBonuses.slice(-3);
  const lastThreeMeritBonusFactor = meritBonuses.slice(-3).reduce((acc, curr) => acc + curr, 0);
  const payments = getPayments(
    DateTime.fromObject({ day: 1, month: 1, year: year - 1 }),
    DateTime.fromObject({ day: 31, month: 12, year: year }).endOf("day"),
    valueByDateRange(pay)
  );

  return [
    {
      pay: pay.slice(),
      lastThreeMeritBonusFactor,
      lastThreeMeritBonuses,
      meritBonusPct,
      meritIncreasePct,
      payments,
      equityIncreasePct,
      retirementBonusPct: 0.15,
    },
  ];
};
