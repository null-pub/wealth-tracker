import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { useDateRanges } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import {
  AddOutcome,
  BonusOutcomes,
  actualizedOutcome,
  outcomeFromSingle,
  scaleOutcome,
} from "shared/utility/min-max-avg";
import { useBaseIncome } from "./use-base-income";
import { useCompanyBonus } from "./use-company-bonus";
import { useMeritBonus } from "./use-merit-bonus";

const bonusPercent = 0.15;
export const useRetirementBonus = (year: number): BonusOutcomes => {
  const actual = useStore(store, (x) => findSameYear(year, x.projectedIncome.timeSeries.retirementBonus)?.value);

  const dateRanges = useDateRanges(year);
  const { totalIncome } = useBaseIncome(dateRanges.retirementBonus.start, dateRanges.retirementBonus.end);

  const meritBonus = useMeritBonus(year);
  const juneBonus = useCompanyBonus(year);

  return useMemo(() => {
    const eligibleIncome = outcomeFromSingle(totalIncome);
    const outcome = scaleOutcome(
      AddOutcome(eligibleIncome, actualizedOutcome(meritBonus.cash), actualizedOutcome(juneBonus.cash)),
      bonusPercent
    );
    return {
      cash: actualizedOutcome({ ...outcome, actual: actual ?? outcome.actual }),
      percent: {
        min: 0.15,
        max: 0.15,
        avg: 0.15,
        actual: 0.15,
      },
    };
  }, [actual, juneBonus.cash, meritBonus.cash, totalIncome]);
};
