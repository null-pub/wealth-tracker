import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useClusters } from "shared/hooks/use-clusters";
import { useDates } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { findMostMostLikely, scaleCluster } from "shared/utility/cluster-helpers";

export const useFutureBonusesTotal = (year: number) => {
  const local = DateTime.local();
  const dates = useDates(year);
  const clusters = useClusters(year);
  const config = useStore(store, (x) => x.projectedWealth);

  const witholdingRate = 1 - config.bonusWithholdingsRate;
  const meritCluster = scaleCluster(findMostMostLikely(clusters.meritBonus), witholdingRate);
  const companyBonusCluster = scaleCluster(findMostMostLikely(clusters.companyBonus), witholdingRate);
  const retirementCluster = findMostMostLikely(clusters.retirementBonus);

  return (
    [
      { payedOn: dates.meritBonus, amount: meritCluster?.median ?? 0 },
      { payedOn: dates.companyBonus, amount: companyBonusCluster?.median ?? 0 },
      { payedOn: dates.retirementBonus, amount: retirementCluster?.median ?? 0 },
    ] as { payedOn: DateTime; amount: number }[]
  )
    .filter(({ payedOn }) => local < payedOn)
    .reduce((acc, curr) => acc + curr.amount, 0);
};
