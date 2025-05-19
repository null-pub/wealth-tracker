import { MAX_NUM_ENTRIES } from "shared/constants";
import { ProjectedIncome } from "shared/models/store/current";
import { findSameYear } from "shared/utility/find-same-year";
import { getMeritSequence } from "./get-merit-sequence";

/**
 * Calculates the expected size of a scenario for a given year
 * Used to prevent generating scenarios that would be too large to process efficiently
 *
 * @param {number} year - The year to calculate scenario size for
 * @param {ProjectedIncome} projectedIncome - Time series data containing historical merit and bonus info
 * @returns {number} The expected size of scenarios for the year
 */
export const getScenarioSize = (year: number, projectedIncome: ProjectedIncome) => {
  const meritSequence = getMeritSequence(year, projectedIncome);
  const companyBonusFactor = findSameYear(year, projectedIncome.timeSeries.companyBonusPct);
  const companyBonusPcts = companyBonusFactor
    ? [companyBonusFactor.value]
    : projectedIncome.timeSeries.companyBonusPct.slice(-1 * MAX_NUM_ENTRIES).map((x) => x.value);

  const companyBonusPctWeights = Object.entries(Object.groupBy(companyBonusPcts, (x) => x)).map(([, values]) => {
    return {
      weight: values!.length,
      value: values!.at(0)!,
    };
  });

  return meritSequence.slice(-1 * MAX_NUM_ENTRIES).length * companyBonusPctWeights.length;
};
