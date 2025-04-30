import { DateTime } from "luxon";
import { Scenario } from "shared/models/scenario";
import { isFuture } from "./is-future";

export const getThresholdTaxRemaining = (taxRate: number, threshold: number, scenario: Scenario) => {
  const remaining = scenario.payments
    .slice(scenario.currentPaymentIdx)
    .filter((x) => x.cumulative >= threshold && isFuture(DateTime.fromISO(x.payedOn)))
    .reduce((acc, curr) => {
      return acc + Math.min(curr.value, curr.cumulative - threshold) * taxRate;
    }, 0);
  return remaining;
};
