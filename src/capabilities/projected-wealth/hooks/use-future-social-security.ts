import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";
import { getLocalDateTime } from "shared/utility/current-date";
import { DateTime } from "luxon";

interface SocialSecurity {
  total: number;
  firstOccurrence: DateTime;
  remaining: number;
  perPaycheck: number;
}

export const useFutureSocialSecurity = () => {
  const config = useStore(store, (x) => x.projectedWealth);
  return useThresholdTax(config.socialSecurityLimit, config.socialSecurityTaxRate);
};

export const useFutureMedicareTax = () => {
  const config = useStore(store, (x) => x.projectedWealth);
  return useThresholdTax(config.medicareSupplementalTaxThreshold, -1 * config.medicareSupplementalTaxRate);
};

export const useThresholdTax = (threshold: number, taxRate: number) => {
  const currentYear = getLocalDateTime().year;
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[currentYear]);

  const data = useMemo(
    () =>
      (
        (scenarios ?? [])
          .map((x) => {
            const total = taxRate * Math.max(0, (x.payments.at(-1)?.cumulative ?? 0) - threshold);
            const firstOccurrence = x.payments.find((x) => x.cumulative > threshold)?.payedOn;
            const remaining = x.payments
              .slice(x.currentPaymentIdx)
              .filter((x) => x.cumulative >= threshold)
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
          .filter((x) => x.firstOccurrence) as SocialSecurity[]
      ).reduce((acc, curr, i) => {
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
      }, {} as Partial<Record<"min" | "max", SocialSecurity>>),
    [threshold, taxRate, scenarios]
  );
  console.log(data);
  return data;
};
