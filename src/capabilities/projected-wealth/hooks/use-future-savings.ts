import { useStore } from "@tanstack/react-store";
import { useDateRanges } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { clamp } from "shared/utility/clamp";

const monthsInYear = 12;

export const useFutureSavings = (year: number) => {
  const config = useStore(store, (x) => x.projectedWealth);
  const dateRanges = useDateRanges(year);
  const monthsRemaining = dateRanges.base.end.diffNow("months").months;

  return {
    remaining: config.savingsPerMonth * clamp(0, monthsRemaining, monthsInYear),
    perMonth: config.savingsPerMonth,
  };
};
