import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { AccountData } from "shared/models/account-data";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { findSameYear } from "shared/utility/find-same-year";
import { useMostFrequentValue } from "./use-most-frequent-value";

export interface TimeSpanValue {
  start: DateTime;
  end: DateTime;
  value: number;
}

export const valueByDateRange = (account: AccountData[]): TimeSpanValue[] => {
  return account.map((x, index, array) => {
    const next = array[index + 1];
    return {
      start: DateTime.fromISO(x.date),
      end: (next?.date ? DateTime.fromISO(next?.date).startOf("day") : DateTime.fromISO(x.date).plus({ years: 1 }))
        .minus({ days: 1 })
        .endOf("day"),
      value: x.value,
    };
  });
};

const systemYear = getLocalDateTime().year;
const defaultValue = {
  start: DateTime.fromObject({
    month: 1,
    day: 1,
    year: systemYear,
  }),
  end: DateTime.fromObject({
    month: 12,
    day: 31,
    year: systemYear,
  }).endOf("day"),
  value: 0,
};

export interface ProjectedPay {
  start: DateTime<true> | DateTime<false>;
  end: DateTime<true> | DateTime<false>;
  value: number;
}

export const useProjectedPay = (): ProjectedPay[] => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const baseIncome = timeSeries.paycheck;
  const meritPct = useMostFrequentValue(timeSeries.meritIncreasePct);

  return useMemo(() => {
    const payPerPeriod = valueByDateRange(baseIncome);
    const mostRecentPay = payPerPeriod[payPerPeriod.length - 1] ?? defaultValue;

    for (let i = 0; i < 2; i++) {
      const { start, end, value } = payPerPeriod[0] ?? mostRecentPay;
      const startDate = start.plus({ years: -1 }).startOf("day");
      const equity = findSameYear(start, timeSeries.equityPct)?.value ?? 0;
      const merit = findSameYear(start, timeSeries.meritIncreasePct)?.value ?? meritPct ?? 0;
      const multiplier = 1 / (1 + merit + equity);

      payPerPeriod.unshift({
        start: startDate,
        end: end.plus({ years: -1 }).endOf("day"),
        value: Math.round(value * multiplier),
      });
    }

    const startIdx = payPerPeriod.length;
    for (let i = 0; i < 11; i++) {
      const { start, end, value } = payPerPeriod[startIdx + i - 1] ?? mostRecentPay;
      const startDate = start.plus({ years: 1 });
      const equity = findSameYear(startDate, timeSeries.equityPct)?.value ?? 0;
      const merit = findSameYear(startDate, timeSeries.meritIncreasePct)?.value ?? meritPct ?? 0;
      const multiplier = 1 + merit + equity;

      payPerPeriod.push({
        start: startDate,
        end: end.plus({ years: 1 }).endOf("day"),
        value: Math.round(value * multiplier),
      });
    }

    return payPerPeriod;
  }, [baseIncome, meritPct, timeSeries.equityPct, timeSeries.meritIncreasePct]);
};
