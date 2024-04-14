import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";

export const useFutureRetirementContributions = (year: number) => {
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);
  const retirementContribution = useStore(store, (x) => x.projectedWealth.retirementContributionPaycheck);

  return useMemo(() => {
    return {
      remaining: Math.min(scenarios?.at(0)?.remainingPayments ?? 0, 26) * retirementContribution,
      perPaycheck: retirementContribution,
    };
  }, [retirementContribution, scenarios]);
};
