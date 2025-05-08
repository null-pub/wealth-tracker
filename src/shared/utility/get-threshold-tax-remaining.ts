import { DateTime } from "luxon";
import { Scenario } from "shared/models/scenario";
import { isFuture } from "./is-future";

/**
 * Calculates the remaining tax amount based on a threshold and tax rate
 * Used for calculating taxes like Social Security or Medicare that have income thresholds
 *
 * @param {number} taxRate - The tax rate to apply (as a decimal)
 * @param {number} threshold - The income threshold above which the tax applies
 * @param {Scenario} scenario - The scenario containing payment information
 * @returns {number} The remaining tax amount to be paid
 */
export const getThresholdTaxRemaining = (taxRate: number, threshold: number, scenario: Scenario) => {
  const remaining = scenario.payments
    .slice(scenario.currentPaymentIdx)
    .filter((x) => x.cumulative >= threshold && isFuture(DateTime.fromISO(x.payedOn)))
    .reduce((acc, curr) => {
      return acc + Math.min(curr.value, curr.cumulative - threshold) * taxRate;
    }, 0);
  return remaining;
};
