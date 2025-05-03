import { useStore } from "@tanstack/react-store";
import { PAYMENTS_PER_YEAR } from "shared/constants";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";

export const useFutureSavings = (year: number) => {
  const savingsPerMonth = useStore(store, (x) => x.projectedWealth.savingsPerMonth);
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);
  const remainingRegularPayments = scenarios?.at(0)?.remainingRegularPayments ?? 0;

  return {
    remaining: savingsPerMonth * Math.min(remainingRegularPayments, PAYMENTS_PER_YEAR),
    perMonth: savingsPerMonth,
  };
};
