import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useClusters } from "shared/hooks/use-clusters";
import { useDates } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { findMostMostLikely, scaleCluster } from "shared/utility/cluster-helpers";

export const useFutureBonuses = (year: number) => {
  const local = DateTime.local();
  const dates = useDates(year);
  const clusters = useClusters(year);
  const config = useStore(store, (x) => x.projectedWealth);

  const bonuses = useMemo(() => {
    return (
      [
        [
          dates.meritBonus,
          scaleCluster(findMostMostLikely(clusters.meritBonus), 1 - config.bonusWithholdingsRate)?.median ?? 0,
        ],
        [
          dates.companyBonus,
          scaleCluster(findMostMostLikely(clusters.companyBonus), 1 - config.bonusWithholdingsRate)?.median ?? 0,
        ],
        [dates.retirementBonus, findMostMostLikely(clusters.retirementBonus)?.median ?? 0],
      ] as [DateTime, number][]
    )
      .map(([payedOn, amount]) => (local < payedOn ? amount : 0))
      .reduce((acc, curr) => acc + curr, 0);
  }, [
    dates.meritBonus,
    dates.companyBonus,
    dates.retirementBonus,
    clusters.meritBonus,
    clusters.companyBonus,
    clusters.retirementBonus,
    config.bonusWithholdingsRate,
    local,
  ]);

  return bonuses;
};
