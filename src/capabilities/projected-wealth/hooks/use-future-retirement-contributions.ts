import { useStore } from "@tanstack/react-store";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";

const paymentsPerYear = 26;

export const useFutureRetirementContributions = (year: number) => {
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);
  const retirementContribution = useStore(store, (x) => x.projectedWealth.retirementContributionPaycheck);
  const remainingRegularPayments = scenarios?.at(0)?.remainingRegularPayments ?? 0;

  return {
    remaining: Math.min(remainingRegularPayments, paymentsPerYear) * retirementContribution,
    perPaycheck: retirementContribution,
  };
};
