import { DateTime } from "luxon";
import { useMemo } from "react";
import { useCompanyBonus } from "capabilities/projected-wealth/hooks/use-company-bonus";
import { useDates } from "shared/hooks/use-dates";
import { useMeritBonus } from "capabilities/projected-wealth/hooks/use-merit-bonus";
import { useRetirementBonus } from "capabilities/projected-wealth/hooks/use-retirement-bonus";

export const useFutureBonuses = () => {
  const local = DateTime.local();
  const year = local.year;
  const dates = useDates(year);
  const meritBonus = useMeritBonus(year);
  const companyBonus = useCompanyBonus(year);
  const retirementBonus = useRetirementBonus(year);

  const bonuses = useMemo(() => {
    return (
      [
        [dates.meritBonus, meritBonus.cash.actual ?? meritBonus.cash.avg],
        [dates.companyBonus, companyBonus.cash.actual ?? companyBonus.cash.avg],
        [dates.retirementBonus, retirementBonus.cash.actual ?? retirementBonus.cash.avg],
      ] as [DateTime, number][]
    )
      .map(([payedOn, amount]) => (local < payedOn ? amount : 0))
      .reduce((acc, curr) => acc + curr, 0);
  }, [
    dates.meritBonus,
    dates.companyBonus,
    dates.retirementBonus,
    meritBonus.cash.actual,
    meritBonus.cash.avg,
    companyBonus.cash.actual,
    companyBonus.cash.avg,
    retirementBonus.cash.actual,
    retirementBonus.cash.avg,
    local,
  ]);

  return bonuses;
};
