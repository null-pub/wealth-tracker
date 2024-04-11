import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";

export const useMeritPairs = (year: number) => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const meritBonusPct = findSameYear(year, timeSeries.meritBonusPct);
  const meritIncreasePct = findSameYear(year, timeSeries.meritIncreasePct);

  return useMemo(() => {
    const allMeritPairs = timeSeries.meritIncreasePct.map((x) => {
      const meritBonusPctPair = findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct);
      return {
        meritIncreasePct: x.value,
        meritBonusPct: meritBonusPctPair?.value ?? 0,
      };
    });

    return allMeritPairs
      .filter((x) => (meritBonusPct ? x.meritBonusPct === meritBonusPct.value : true))
      .filter((x) => (meritIncreasePct ? x.meritIncreasePct === meritIncreasePct?.value : true));
  }, [meritBonusPct, meritIncreasePct, timeSeries.meritBonusPct, timeSeries.meritIncreasePct]);
};
