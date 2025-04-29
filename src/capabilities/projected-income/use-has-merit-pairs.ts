import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";

export const useHasMeritPairs = () => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);

  return (
    timeSeries.meritIncreasePct.every((x) => {
      return !!findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct);
    }) &&
    timeSeries.meritBonusPct.every((x) => {
      return !!findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritIncreasePct);
    })
  );
};
