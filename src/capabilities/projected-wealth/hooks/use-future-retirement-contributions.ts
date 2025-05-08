import { useStore } from "@tanstack/react-store";
import { PAYMENTS_PER_YEAR } from "shared/constants";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";

/**
 * Hook that calculates future retirement contributions based on current contribution rate and remaining payments
 *
 * @param {number} year - The year to calculate retirement contributions for
 * @returns {Object} Object containing:
 * - remaining: Total remaining retirement contributions for the year
 * - perPaycheck: Retirement contribution amount per paycheck
 */
export const useFutureRetirementContributions = (year: number) => {
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);
  const retirementContribution = useStore(store, (x) => x.projectedWealth.retirementContributionPaycheck);
  const remainingRegularPayments = scenarios?.at(0)?.remainingRegularPayments ?? 0;

  return {
    remaining: Math.min(remainingRegularPayments, PAYMENTS_PER_YEAR) * retirementContribution,
    perPaycheck: retirementContribution,
  };
};
