import { useStore } from "@tanstack/react-store";
import { useDateRanges } from "shared/hooks/use-dates";
import { store } from "shared/store";

export const useFutureSavings = (year: number) => {
  const config = useStore(store, (x) => x.projectedWealth);
  const dateRanges = useDateRanges(year);

  return {
    remaining: config.savingsPerMonth * Math.min(Math.max(0, dateRanges.base.end.diffNow("months").months), 12),
    perMonth: config.savingsPerMonth,
  };
};
