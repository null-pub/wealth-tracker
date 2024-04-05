import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useDateRanges } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import { BonusOutcomes, actualizedOutcome, minMaxAvg, scaleOutcome } from "shared/utility/min-max-avg";
import { useBaseIncome } from "./use-base-income";

export const useCompanyBonus = (year: number): BonusOutcomes => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const dateRanges = useDateRanges(year);
  const { totalIncome } = useBaseIncome(dateRanges.companyBonus.start, dateRanges.companyBonus.end);

  return useMemo(() => {
    const mostRecentBonus = findSameYear(year, timeSeries.companyBonus);
    const mostRecentPercent = findSameYear(year, timeSeries.companyBonusPct);

    const meritFactor = timeSeries.meritBonusPct
      .filter((x) => DateTime.fromISO(x.date).year <= year)
      .slice(-3)
      .reduce((acc, curr) => acc + curr.value, 0);

    const outcomes = minMaxAvg(timeSeries.companyBonusPct.map((x) => x.value));
    const cash = scaleOutcome(outcomes, meritFactor * totalIncome);
    const projectedActual = mostRecentPercent?.value ? mostRecentPercent?.value * meritFactor * totalIncome : undefined;

    return {
      percent: actualizedOutcome({
        ...outcomes,
        actual: mostRecentPercent?.value,
      }),
      cash: actualizedOutcome({
        ...cash,
        actual: mostRecentBonus?.value ?? projectedActual,
      }),
    };
  }, [totalIncome, timeSeries.companyBonus, timeSeries.companyBonusPct, timeSeries.meritBonusPct, year]);
};
