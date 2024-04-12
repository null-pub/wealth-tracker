import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useDateRanges } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import { BonusOutcomes, actualizedOutcome, minMaxAvg, scaleOutcome } from "shared/utility/min-max-avg";
import { useBaseIncome } from "./use-base-income";
import { useMostFrequentValue } from "./use-most-frequent-value";

export const useMeritBonus = (year: number): BonusOutcomes => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const ranges = useDateRanges(year);
  const { totalIncome } = useBaseIncome(ranges.meritBonus.start, ranges.meritBonus.end);

  const bonusAmount = useMemo(() => {
    return findSameYear(year, timeSeries.meritBonus)?.value;
  }, [timeSeries.meritBonus, year]);

  const bonusPercent = useMemo(() => {
    return findSameYear(year, timeSeries.meritBonusPct)?.value;
  }, [timeSeries.meritBonusPct, year]);

  const frequentMeritBonusPercent = useMostFrequentValue(timeSeries.meritBonusPct);

  return useMemo(() => {
    const meritOutcome = minMaxAvg(
      timeSeries.meritBonusPct.filter((x) => DateTime.fromISO(x.date).year <= year).map((x) => x.value)
    );
    meritOutcome.avg = frequentMeritBonusPercent ?? 0;

    return {
      percent: actualizedOutcome({ ...meritOutcome, actual: bonusPercent }),
      cash: actualizedOutcome({
        ...scaleOutcome(meritOutcome, totalIncome),
        actual: bonusAmount ?? (bonusPercent ? totalIncome * bonusPercent : undefined),
      }),
    };
  }, [bonusAmount, bonusPercent, frequentMeritBonusPercent, timeSeries.meritBonusPct, totalIncome, year]);
};
