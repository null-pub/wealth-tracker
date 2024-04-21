import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { findNearestIdxOnOrBefore, findNearestOnOrBefore } from "shared/utility/find-nearest-on-or-before";
import { calcEquity, calcLoanBalance } from "shared/utility/mortgage-calc";
import { useEarliestAccountEntry } from "../../../shared/hooks/use-earliest-account-entry";
import { useFutureBonuses } from "./use-future-bonuses";
import { useFutureRetirementContributions } from "./use-future-retirement-contributions";
import { useFutureSavings } from "./use-future-savings";
import { useFutureMedicareTax, useFutureSocialSecurity } from "./use-future-social-security";

export interface TimeSeriesWealth {
  graphDate: Date;
  date: DateTime;
  wealth: number;
  yoyCash?: number;
  yoyPct?: number;
}

const useFutureWealth = (year: number) => {
  const bonuses = useFutureBonuses(year);
  const savings = useFutureSavings(year);
  const ssiTaxValue = useFutureSocialSecurity(year);
  const medicareTaxValue = useFutureMedicareTax(year);
  const retirementContribution = useFutureRetirementContributions(year);

  return (
    bonuses +
    savings.remaining +
    retirementContribution.remaining +
    (ssiTaxValue.min?.remaining ?? 0) +
    (medicareTaxValue?.min?.remaining ?? 0)
  );
};

const useFuturesWealth = () => {
  const year = getLocalDateTime().year;
  return {
    [year + 1]: useFutureWealth(year),
    [year + 2]: useFutureWealth(year + 1) + useFutureWealth(year),
  };
};

export const useTimeSeriesWealth = (year: number) => {
  const localDateTime = getLocalDateTime();
  const earliest = useEarliestAccountEntry();
  const accounts = useStore(store, (x) => x.wealth);
  const futuresWealth = useFuturesWealth();

  const data = useMemo(() => {
    if (!earliest.isValid) {
      return [];
    }

    const dates = new Array(year + 2 - earliest.year)
      .fill(earliest.year)
      .map((x, i) => DateTime.fromObject({ day: 1, month: 1, year: x + i }).startOf("day"));

    const idx = findNearestIdxOnOrBefore(localDateTime, dates, (x) => x);
    if (!dates.some((x) => x.equals(localDateTime.startOf("day")))) {
      dates.splice(idx + 1, 0, localDateTime);
    }

    const futureBenchmarkIdx = idx;

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
      });
  }, [earliest.isValid, earliest.year, year, localDateTime, accounts, futuresWealth]);
  return data as TimeSeriesWealth[];
};
