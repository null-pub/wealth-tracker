import { MAX_NUM_ENTRIES } from "shared/constants";
import { TimeSeries } from "shared/models/store/current";
import { findSameYear } from "shared/utility/find-same-year";
import { getMeritSequence } from "./get-merit-sequence";

export const getScenarioSize = (year: number, timeSeries: TimeSeries) => {
  const meritSequence = getMeritSequence(year, timeSeries);
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

  return meritSequence.slice(-1 * MAX_NUM_ENTRIES).length * companyBonusPctWeights.length;
};
