import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { store } from "shared/store";
import { usePayments } from "./use-payments";

export const useFutureRetirementContributions = () => {
  const { numRemaining } = usePayments();
  const retirementContribution = useStore(store, (x) => x.projectedWealth.retirementContributionPaycheck);

  return useMemo(() => {
    return {
      remaining: numRemaining * retirementContribution,
      perPaycheck: retirementContribution,
    };
  }, [numRemaining, retirementContribution]);
};
