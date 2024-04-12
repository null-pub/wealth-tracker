import { useMemo } from "react";
import { useDateRanges } from "shared/hooks/use-dates";
import { AddOutcome, actualizedOutcome, outcomeFromSingle } from "shared/utility/min-max-avg";
import { useBaseIncome } from "./use-base-income";
import { useCompanyBonus } from "./use-company-bonus";
import { useMeritBonus } from "./use-merit-bonus";
import { useRetirementBonus } from "./use-retirement-bonus";

export const useTotalIncome = (year: number) => {
  const { base } = useDateRanges(year);
  const baseIncome = useBaseIncome(base.start, base.end);

  const meritBonus = useMeritBonus(year);
  const juneBonus = useCompanyBonus(year);
  const julyBonus = useRetirementBonus(year);

  return useMemo(() => {
    const taxableIncome = AddOutcome(
      outcomeFromSingle(baseIncome.totalIncome),
      actualizedOutcome(meritBonus.cash),
      actualizedOutcome(juneBonus.cash)
    );
    const totalIncome = AddOutcome(taxableIncome, actualizedOutcome(julyBonus.cash));
    return { taxableIncome, totalIncome };
  }, [baseIncome.totalIncome, julyBonus.cash, juneBonus.cash, meritBonus.cash]);
};
