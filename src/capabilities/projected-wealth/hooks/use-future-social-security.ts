import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";
import { isFuture } from "shared/utility/is-future";

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
  return useMemo(() => {
    return {
      min: taxes.max,
      max: taxes.min,
    };
  }, [taxes]);
};

export type ThresholdTax = Partial<Record<"min" | "max", ThresholdTaxData>>;

const useThresholdTax = (year: number, threshold: number, taxRate: number): ThresholdTax => {
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);

  const data = useMemo(
    () =>
      (
        (scenarios ?? [])
          .map((x) => {
            const total = taxRate * Math.max(0, (x.payments.at(-1)?.cumulative ?? 0) - threshold);
            const firstOccurrence = x.payments.find((x) => x.cumulative > threshold)?.payedOn;
            const remaining = x.payments
              .slice(x.currentPaymentIdx)
              .filter((x) => x.cumulative >= threshold && isFuture(DateTime.fromISO(x.payedOn)))
              .reduce((acc, curr) => {
                return acc + Math.min(curr.value, curr.cumulative - threshold) * taxRate;
              }, 0);
            const perPaycheck = total && taxRate * (x.payments.at(-1)?.value ?? 0);

            return {
              total,
              firstOccurrence: firstOccurrence ? DateTime.fromISO(firstOccurrence) : undefined,
              remaining,
              perPaycheck,
            };
          })
          .filter((x) => x.firstOccurrence) as ThresholdTaxData[]
      ).reduce(
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
      ),
    [threshold, taxRate, scenarios]
  );

  return data;
};
