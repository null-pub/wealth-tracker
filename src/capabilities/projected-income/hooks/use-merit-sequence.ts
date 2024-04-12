import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { useMeritPairs } from "./use-merit-pairs";

export const useMeritSequence = (year: number) => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const meritPairs = useMeritPairs(year);

  return useMemo(() => {
    const pay = timeSeries.paycheck.filter((x) => DateTime.fromISO(x.date).year > year - 3);
    const mostRecentPay = pay.at(-1) ?? timeSeries.paycheck.at(-1);

    if (!mostRecentPay) {
      return [];
    }

    const yearsToGenerate = Math.max(year - DateTime.fromISO(mostRecentPay.date).year, 1);

    let meritSequence = meritPairs.slice().map((x) => [x]);
    for (let i = 0; i < yearsToGenerate - 1; i++) {
      meritSequence = meritSequence.flatMap((x) => {
        return meritPairs.map((merit) => {
          return x.slice().concat(merit);
        });
      });
    }
    return meritSequence;
  }, [meritPairs, timeSeries.paycheck, year]);
};
