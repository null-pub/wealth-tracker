import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { findNearestOnOrBefore } from "shared/utility/find-nearest-on-or-before";
import { calcEquity, calcLoanBalance } from "shared/utility/mortgage-calc";
import { useEarliestAccountEntry } from "./use-earliest-account-entry";
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

export const useTimeSeriesWealth = () => {
  const localDateTime = getLocalDateTime();
  const earliest = useEarliestAccountEntry();
  const accounts = useStore(store, (x) => x.wealth);
  const bonuses = useFutureBonuses();

  const savings = useFutureSavings();
  const ssiTaxValue = useFutureSocialSecurity();
  const medicareTaxValue = useFutureMedicareTax();
  const retirementContribution = useFutureRetirementContributions();

  const data = useMemo(() => {
    if (!earliest.isValid) {
      return [];
    }

    const futureWealth =
      bonuses +
      savings.remaining +
      retirementContribution.remaining +
      (ssiTaxValue.min?.remaining ?? 0) +
      (medicareTaxValue?.min?.remaining ?? 0);

    const dates = new Array(localDateTime.year + 2 - earliest.year)
      .fill(earliest.year)
      .map((x, i) => DateTime.fromObject({ day: 1, month: 1, year: x + i }).startOf("day"));

    if (!localDateTime.equals(dates[dates.length - 2])) {
      dates.splice(-1, 0, localDateTime);
    }

    return dates
      .map((date, idx, arr) => {
        const isLast = idx === arr.length - 1;
        const accountWealth = Object.values(accounts)
          .map((x) => {
            if (x.type === "mortgage" && x.loan) {
              const houseValue = findNearestOnOrBefore(date, x.data);
              const balance = calcLoanBalance(date, x.loan);
              return calcEquity(x.loan.ownershipPct, houseValue?.value, balance, x.loan.principal);
            } else if (x.type === "account") {
              const entry = findNearestOnOrBefore(date, x.data);
              return entry?.value ?? 0;
            }
            return 0;
          })
          .reduce((acc, curr) => acc + curr, 0);

        return {
          date,
          graphDate: date.toJSDate(),
          wealth: accountWealth + (isLast ? futureWealth : 0),
        };
      })
      .map((x, idx, arr) => {
        if (idx !== arr.length - 1) {
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

        const benchmarkWealth = arr[idx - 2]?.wealth;
        if (!benchmarkWealth) {
          return x;
        }
        return {
          ...x,
          yoyCash: x.wealth - benchmarkWealth,
          yoyPct: x.wealth / benchmarkWealth - 1,
        };
      });
  }, [
    earliest.isValid,
    earliest.year,
    bonuses,
    savings.remaining,
    retirementContribution.remaining,
    ssiTaxValue.min,
    medicareTaxValue.min,
    localDateTime,
    accounts,
  ]);
  return data as TimeSeriesWealth[];
};
