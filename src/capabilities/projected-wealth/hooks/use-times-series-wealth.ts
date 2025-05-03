import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useEarliestAccountEntry } from "shared/hooks/use-earliest-account-entry";
import { store } from "shared/store";
import { findMostMostLikely } from "shared/utility/cluster-helpers";
import { getLocalDateTime } from "shared/utility/current-date";
import { findNearestIdxOnOrBefore, findNearestOnOrBefore } from "shared/utility/find-nearest-on-or-before";
import { calcEquity, calcLoanBalance } from "shared/utility/mortgage-calc";
import { useFutureTotals } from "./use-future-totals";

export interface TimeSeriesWealth {
  graphDate: Date;
  date: DateTime;
  wealth: number;
  yoyCash?: number;
  yoyPct?: number;
}

const useFuturesWealth = () => {
  const year = getLocalDateTime().year;
  const totals = useFutureTotals(year, { excludeHomeEquity: true });
  const totalsPlusOne = useFutureTotals(year + 1, { excludeHomeEquity: true });

  return {
    [year + 1]: findMostMostLikely(totals)?.median ?? 0,
    [year + 2]: (findMostMostLikely(totals)?.median ?? 0) + (findMostMostLikely(totalsPlusOne)?.median ?? 0),
  };
};

export const useTimeSeriesWealth = (year: number) => {
  const localDateTime = getLocalDateTime().startOf("day");
  const earliest = useEarliestAccountEntry();
  const accounts = useStore(store, (x) => x.wealth);
  const futuresWealth = useFuturesWealth();

  if (!earliest.isValid) {
    return [] as TimeSeriesWealth[];
  }

  const dates = new Array(year + 2 - earliest.year)
    .fill(earliest.year)
    .map((x, i) => DateTime.fromObject({ day: 1, month: 1, year: x + i }).startOf("day"));

  const futureBenchmarkIdx = findNearestIdxOnOrBefore(localDateTime, dates, (x) => x);

  if (!dates.some((x) => x.equals(localDateTime))) {
    dates.splice(futureBenchmarkIdx + 1, 0, localDateTime);
  }

  return dates
    .map((date) => {
      const accountsWealth = Object.values(accounts).map((x) => {
        if (x.type === "mortgage" && x.loan) {
          const houseValue = findNearestOnOrBefore(date, x.data);
          const balance = calcLoanBalance(date, x.loan);
          return calcEquity(x.loan.ownershipPct, houseValue?.value, balance, x.loan.principal);
        } else if (x.type === "account") {
          const entry = findNearestOnOrBefore(date, x.data);
          return entry?.value ?? 0;
        }
        return 0;
      });

      const accountWealth = accountsWealth.reduce((acc, curr) => acc + curr, 0);
      const futureWealth = futuresWealth[date.year] ?? 0;

      return {
        date,
        graphDate: date.toJSDate(),
        wealth: accountWealth + futureWealth,
      };
    })
    .map((x, idx, arr) => {
      if (x.date <= localDateTime || x.date.year === localDateTime.year + 2) {
        const benchmarkWealth = arr[idx - 1]?.wealth;
        if (!benchmarkWealth) {
          return x;
        }
        return {
          ...x,
          yoyCash: x.wealth - benchmarkWealth,
          yoyPct: x.wealth / benchmarkWealth - 1,
        };
      }

      const benchmarkWealth = arr[futureBenchmarkIdx]?.wealth;
      if (!benchmarkWealth) {
        return x;
      }
      return {
        ...x,
        yoyCash: x.wealth - benchmarkWealth,
        yoyPct: x.wealth / benchmarkWealth - 1,
      };
    }) as TimeSeriesWealth[];
};
