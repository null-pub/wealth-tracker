import { DateTime } from "luxon";
import { MAX_NUM_ENTRIES } from "shared/constants";
import { ProjectedIncome, Rating, ratingToTimeSeries } from "shared/models/store/current";
import { findSameYear } from "shared/utility/find-same-year";

type UnweightedPairs = {
  meritIncreasePct: number;
  meritBonusPct: number;
};

/**
 *
 * @param year year to generate merit pairs for
 * @param {ProjectedIncome} projectedIncome pojected
 * @returns an array of possible merit pairs with their frequency weighted
 */
const getMeritPairs = (year: number, projectedIncome: ProjectedIncome) => {
  const { config, timeSeries } = projectedIncome;
  const actualMeritDetails = findSameYear(year, timeSeries.meritPct);

  if (actualMeritDetails && actualMeritDetails.enabled) {
    return [
      {
        meritIncreasePct: actualMeritDetails.meritIncreasePct,
        meritBonusPct: actualMeritDetails.meritBonusPct,
        rating: actualMeritDetails.rating,
        weight: 1,
      },
    ];
  }

  const getConfiguredValue = (rating?: Rating) => {
    const key = rating ? ratingToTimeSeries[rating] : undefined;
    if (key && config[key]) {
      return {
        meritIncreasePct: (config[key].meritIncreasePct ?? 0) > 0 ? config[key].meritIncreasePct : undefined,
        meritBonusPct: (config[key].bonusPct ?? 0) > 0 ? config[key].bonusPct : undefined,
      };
    }
  };

  const unweightedPairs = timeSeries.meritPct
    .filter((x) => x.enabled)
    .slice(-1 * MAX_NUM_ENTRIES)
    .map((x) => {
      const config = getConfiguredValue(x.rating);
      return {
        meritIncreasePct: config ? config.meritIncreasePct : x.meritIncreasePct,
        meritBonusPct: config ? config.meritBonusPct : x.meritBonusPct,
        rating: actualMeritDetails?.rating,
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

/**
 * Gets the merit sequence for a given year, including historical data and projections
 * Used to calculate likely merit increases and bonuses based on past performance
 *
 * @param {number} year - Target year to get merit sequence for
 * @param {TimeSeries} timeSeries - Time series data containing merit history
 * @returns {Array<{weight: number, values: MeritSequenceValues[]}>} Array of possible merit sequences with weights
 */
export const getMeritSequence = (year: number, projectedIncome: ProjectedIncome) => {
  const { timeSeries } = projectedIncome;
  const meritPairs = getMeritPairs(year, projectedIncome);

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
