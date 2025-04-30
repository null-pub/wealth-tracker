import { DateTime } from "luxon";
import { MAX_NUM_ENTRIES } from "shared/constants";
import { ProjectedIncome, TimeSeries } from "shared/models/store/current";
import { findSameYear } from "shared/utility/find-same-year";
import { groupBySingle } from "shared/utility/group-by-single";

type UnweightedPairs = {
  meritIncreasePct: number;
  meritBonusPct: number;
};

/**
 *
 * @param year year to generate merit pairs for
 * @param timeseries pojected
 * @returns an array of possible merit pairs with their frequency weighted
 */
const getMeritPairs = (year: number, timeSeries: TimeSeries) => {
  const meritBonusPct = findSameYear(year, timeSeries.meritBonusPct);
  const meritIncreasePct = findSameYear(year, timeSeries.meritIncreasePct);

  if (meritBonusPct && meritIncreasePct) {
    return [
      {
        meritIncreasePct: meritIncreasePct.value,
        meritBonusPct: meritBonusPct.value,
        weight: 1,
      },
    ];
  }

  const meritBonusPctByYear = groupBySingle(timeSeries.meritBonusPct, (x) => DateTime.fromISO(x.date).year);
  const unweightedPairs = timeSeries.meritIncreasePct.slice(-1 * MAX_NUM_ENTRIES).map((x) => {
    const meritBonusPctPair = meritBonusPctByYear[DateTime.fromISO(x.date).year];
    return {
      meritIncreasePct: x.value,
      meritBonusPct: meritBonusPctPair?.value ?? 0,
    };
  });

  const groupsOfPairs = Object.values(
    Object.groupBy(unweightedPairs, (x) => `${x.meritBonusPct} ${x.meritIncreasePct}`)
  ) as UnweightedPairs[][];

  return groupsOfPairs.map((x) => {
    return {
      ...x[0],
      weight: x.length,
    };
  });
};

export const getMeritSequence = (year: number, projectedIncome: ProjectedIncome) => {
  const timeSeries = projectedIncome.timeSeries;
  const meritPairs = getMeritPairs(year, timeSeries);

  const pay = timeSeries.paycheck.filter((x) => DateTime.fromISO(x.date).year > year - 3);
  const mostRecentPay = pay.at(-1) ?? timeSeries.paycheck.at(-1);

  if (!mostRecentPay) {
    return [];
  }

  const mostRecentPayYear = DateTime.fromISO(mostRecentPay.date).year;
  const yearsToGenerate = Math.max(year - mostRecentPayYear, 1);

  //generate all possible merit sequences that could happen from now to target year
  let meritSequence = meritPairs.slice().map((x) => [x]);
  for (let i = 0; i < yearsToGenerate - 1; i++) {
    meritSequence = meritSequence.flatMap((x) => {
      return meritPairs.map((merit) => {
        return x.slice().concat(merit);
      });
    });
  }

  return meritSequence.map((values) => {
    return {
      weight: values.reduce((acc, curr) => acc * curr.weight, 1),
      values: values,
    };
  });
};
