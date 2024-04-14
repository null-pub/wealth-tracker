import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { scenarioStore } from "shared/store/scenario-store";

export const useFutureRetirementContributions = () => {
  const currentYear = getLocalDateTime().year;
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[currentYear]);
  const retirementContribution = useStore(store, (x) => x.projectedWealth.retirementContributionPaycheck);

  return useMemo(() => {
    return {
      remaining: (scenarios?.[0].remainingPayments ?? 0) * retirementContribution,
      perPaycheck: retirementContribution,
    };
  }, [retirementContribution, scenarios]);
};
