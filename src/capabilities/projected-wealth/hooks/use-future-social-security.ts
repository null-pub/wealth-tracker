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

export const useFutureSocialSecurity = (year: number): ThresholdTax => {
  const config = useStore(store, (x) => x.projectedWealth);
  return useThresholdTax(year, config.socialSecurityLimit, config.socialSecurityTaxRate);
};

export const useFutureMedicareTax = (year: number): ThresholdTax => {
  const config = useStore(store, (x) => x.projectedWealth);
  const taxes = useThresholdTax(year, config.medicareSupplementalTaxThreshold, -1 * config.medicareSupplementalTaxRate);

  return {
    min: taxes.max,
    max: taxes.min,
  };
};

export type ThresholdTax = Partial<Record<"min" | "max", ThresholdTaxData>>;

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
