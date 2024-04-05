import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { store } from "shared/store";
import { usePayments } from "./use-payments";

export const useFutureSocialSecurity = () => {
  const { payments, nextPaymentIdx } = usePayments();
  const config = useStore(store, (x) => x.projectedWealth);

  return useMemo(() => {
    const total =
      config.socialSecurityTaxRate * Math.max(0, (payments.at(-1)?.cumulative ?? 0) - config.socialSecurityLimit);
    const firstOccurrence = payments.find((x) => x.cumulative >= config.socialSecurityLimit)?.payedOn;

    const remaining = payments
      .slice(nextPaymentIdx)
      .filter((x) => x.cumulative >= config.socialSecurityLimit)
      .reduce((acc, curr) => {
        return acc + Math.min(curr.value, curr.cumulative - config.socialSecurityLimit) * config.socialSecurityTaxRate;
      }, 0);

    const perPaycheck = total && config.socialSecurityTaxRate * (payments.at(-1)?.value ?? 0);

    return {
      total,
      remaining,
      perPaycheck,
      firstOccurrence,
    };
  }, [config.socialSecurityLimit, config.socialSecurityTaxRate, nextPaymentIdx, payments]);
};
