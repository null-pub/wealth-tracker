import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { store } from "shared/store";
import { usePayments } from "./use-payments";

export const useFutureMedicareTax = () => {
  const { payments, nextPaymentIdx } = usePayments();
  const config = useStore(store, (x) => x.projectedWealth);

  return useMemo(() => {
    const total =
      config.medicareSupplementalTaxRate *
      Math.min(0, config.medicareSupplementalTaxThreshold - (payments.at(-1)?.cumulative ?? 0));

    const firstOccurrence = payments.find((x) => x.cumulative >= config.medicareSupplementalTaxThreshold)?.payedOn;

    const remaining = payments
      .slice(nextPaymentIdx)
      .filter((x) => x.cumulative >= config.medicareSupplementalTaxThreshold)
      .reduce((acc, curr) => {
        return (
          acc -
          Math.min(curr.value, curr.cumulative - config.medicareSupplementalTaxThreshold) *
            config.medicareSupplementalTaxRate
        );
      }, 0);

    const perPaycheck = total && (payments.at(-1)?.value ?? 0) * config.medicareSupplementalTaxRate;

    return {
      total,
      remaining,
      perPaycheck,
      firstOccurrence,
    };
  }, [config.medicareSupplementalTaxRate, config.medicareSupplementalTaxThreshold, nextPaymentIdx, payments]);
};
