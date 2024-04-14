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
  const currentYear = getLocalDateTime().year;
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[currentYear]);

  const data = useMemo(
    () =>
      (
        (scenarios ?? [])
          .map((x) => {
            const total =
              config.socialSecurityTaxRate *
              Math.max(0, (x.payments.at(-1)?.cumulative ?? 0) - config.socialSecurityLimit);
            const firstOccurrence = x.payments.find((x) => x.cumulative > config.socialSecurityLimit)?.payedOn;
            const remaining = x.payments
              .slice(x.currentPaymentIdx)
              .filter((x) => x.cumulative >= config.socialSecurityLimit)
              .reduce((acc, curr) => {
                return (
                  acc +
                  Math.min(curr.value, curr.cumulative - config.socialSecurityLimit) * config.socialSecurityTaxRate
                );
              }, 0);
            const perPaycheck = total && config.socialSecurityTaxRate * (x.payments.at(-1)?.value ?? 0);

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
    [config.socialSecurityLimit, config.socialSecurityTaxRate, scenarios]
  );
  console.log(data);
  return data;
};
