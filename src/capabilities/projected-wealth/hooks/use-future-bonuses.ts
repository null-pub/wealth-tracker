import { DateTime } from "luxon";
import { useMemo } from "react";
import { useDates } from "shared/hooks/use-dates";
import { useClusters } from "capabilities/projected-income/hooks/use-gradient";
import { findMostMostLikely, scaleCluster } from "shared/utility/cluster-helpers";
import { useStore } from "@tanstack/react-store";
import { store } from "shared/store";

export const useFutureBonuses = () => {
  const local = DateTime.local();
  const year = local.year;
  const dates = useDates(year);
  const clusters = useClusters(year);
  const config = useStore(store, (x) => x.projectedWealth);

  const bonuses = useMemo(() => {
    return (
      [
        [
          dates.meritBonus,
          scaleCluster(findMostMostLikely(clusters.meritBonus), config.bonusWitholdingsRate)?.median ?? 0,
        ],
        [
          dates.companyBonus,
          scaleCluster(findMostMostLikely(clusters.companyBonus), config.bonusWitholdingsRate)?.median ?? 0,
        ],
        [
          dates.retirementBonus,
          scaleCluster(findMostMostLikely(clusters.retirementBonus), config.bonusWitholdingsRate)?.median ?? 0,
        ],
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
    config.bonusWitholdingsRate,
    local,
  ]);

  return bonuses;
};
