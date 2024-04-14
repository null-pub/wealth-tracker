import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";
import { getLocalDateTime } from "shared/utility/current-date";

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
