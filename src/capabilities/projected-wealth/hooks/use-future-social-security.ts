import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";
import { getThresholdTaxRemaining } from "shared/utility/get-threshold-tax-remaining";

interface ThresholdTaxData {
  total: number;
  firstOccurrence: DateTime;
  remaining: number;
  perPaycheck: number;
}

export type ThresholdTax = Partial<Record<"min" | "max", ThresholdTaxData>>;

/**
 * Hook that calculates tax data based on a given threshold and tax rate
 *
 * @param {number} year - The year to calculate taxes for
 * @param {number} threshold - The income threshold where the tax applies
 * @param {number} taxRate - The tax rate to apply
 * @returns {ThresholdTax} Object containing minimum and maximum tax scenarios
 */
const useThresholdTax = (year: number, threshold: number, taxRate: number): ThresholdTax => {
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);

  const taxesOwedPerScenario = (scenarios ?? [])
    .map((x) => {
      const totalTaxable = x.payments.at(-1)?.cumulative ?? 0;
      const taxableAmountOverThreshold = Math.max(0, totalTaxable - threshold);
      const total = taxRate * taxableAmountOverThreshold;
      const firstOccurrence = x.payments.find((x) => x.cumulative > threshold)?.payedOn;
      const remaining = getThresholdTaxRemaining(taxRate, threshold, x);
      const lastPaycheck = x.payments.at(-1)?.value ?? 0;
      const perPaycheck = total && taxRate * lastPaycheck;

      return {
        total,
        firstOccurrence: firstOccurrence ? DateTime.fromISO(firstOccurrence) : undefined,
        remaining,
        perPaycheck,
      };
    })
    .filter((x) => x.firstOccurrence) as ThresholdTaxData[];

  return taxesOwedPerScenario.reduce(
    (acc, curr, i) => {
      if (i == 0) {
        return { min: curr, max: curr };
      } else {
        if (curr.total < acc.min!.total) {
          acc.min = curr;
        }
        if (curr.total > acc.max!.total) {
          acc.max = curr;
        }
      }
      return acc;
    },
    {} as Partial<Record<"min" | "max", ThresholdTaxData>>
  );
};

/**
 * Hook that calculates social security tax data
 *
 * @param {number} year - The year to calculate social security tax for
 * @returns {ThresholdTax} Object containing minimum and maximum social security tax scenarios
 */
export const useFutureSocialSecurity = (year: number): ThresholdTax => {
  const config = useStore(store, (x) => x.projectedWealth);
  return useThresholdTax(year, config.socialSecurityLimit, config.socialSecurityTaxRate);
};

/**
 * Hook that calculates Medicare supplemental tax data
 *
 * @param {number} year - The year to calculate Medicare tax for
 * @returns {ThresholdTax} Object containing minimum and maximum Medicare tax scenarios
 */
export const useFutureMedicareTax = (year: number): ThresholdTax => {
  const config = useStore(store, (x) => x.projectedWealth);
  const taxes = useThresholdTax(year, config.medicareSupplementalTaxThreshold, -1 * config.medicareSupplementalTaxRate);

  return {
    min: taxes.max,
    max: taxes.min,
  };
};
