import { useStore } from "@tanstack/react-store";
import { PAYMENTS_PER_YEAR } from "shared/constants";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";

/**
 * Hook that calculates future savings based on current savings rate and remaining payments
 *
 * @param {number} year - The year to calculate future savings for
 * @returns {Object} Object containing:
 * - remaining: Total remaining savings for the year
 * - perPaycheck: Savings amount per paycheck
 */
export const useFutureSavings = (year: number) => {
  const savingsPerPaycheck = useStore(store, (x) => x.projectedWealth.savingsPerPaycheck);
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);
  const remainingRegularPayments = scenarios?.at(0)?.remainingRegularPayments ?? 0;

  return {
    remaining: savingsPerPaycheck * Math.min(remainingRegularPayments, PAYMENTS_PER_YEAR),
    perPaycheck: savingsPerPaycheck,
  };
};
