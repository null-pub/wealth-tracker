import { MAX_NUM_ENTRIES } from "shared/constants";
import { ProjectedIncome } from "shared/models/store/current";
import { findSameYear } from "shared/utility/find-same-year";
import { getMeritSequence } from "./get-merit-sequence";

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
