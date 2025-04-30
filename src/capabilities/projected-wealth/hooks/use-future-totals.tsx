import { useStore } from "@tanstack/react-store";
import { useDates } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";
import { clusterTitle, getClusterCount } from "shared/utility/cluster-helpers";
import { getThresholdTaxRemaining } from "shared/utility/get-threshold-tax-remaining";
import { isFuture } from "shared/utility/is-future";
import { ckmeans, median, sumSimple } from "simple-statistics";
import { useFutureMortgageEquity } from "./use-future-mortgage-equity";
import { useFutureRetirementContributions } from "./use-future-retirement-contributions";
import { useFutureSavings } from "./use-future-savings";

export const useFutureTotals = (year: number, options: { excludeHomeEquity: boolean } = { excludeHomeEquity: false }) => {
  const { excludeHomeEquity } = options;
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);
  const bonusTakeHomeFactor = useStore(store, (x) => 1 - x.projectedWealth.bonusWithholdingsRate);
  const savings = useFutureSavings(year);
  const homeEquity = useFutureMortgageEquity(year);
  const retirement = useFutureRetirementContributions(year);
  const config = useStore(store, (x) => x.projectedWealth);

  const dates = useDates(year);

  const rawClusters = (() => {
    const totals = scenarios?.map((x) => {
      const futureEvents = [
        isFuture(dates.meritBonus) && x.meritBonus * bonusTakeHomeFactor,
        isFuture(dates.companyBonus) && x.companyBonus * bonusTakeHomeFactor,
        isFuture(dates.retirementBonus) && x.retirementBonus,
        getThresholdTaxRemaining(config.socialSecurityTaxRate, config.socialSecurityLimit, x),
        getThresholdTaxRemaining(-1 * config.medicareSupplementalTaxRate, config.medicareSupplementalTaxThreshold, x),
        savings.remaining,
        retirement.remaining,
        excludeHomeEquity ? 0 : homeEquity,
      ].filter((x) => x) as number[];
      return sumSimple(futureEvents);
    });

    if (!totals || totals.length === 0) {
      return [[savings.remaining + retirement.remaining]];
    }

    const clusters = ckmeans(
      totals,
      getClusterCount(totals, (x) => x)
    );
    return clusters;
  })();

  const numValues = rawClusters.flat().length;
  return rawClusters.map((x, i, arr) => {
    return {
      min: Math.min(...x),
      max: Math.max(...x),
      median: median(x),
      probability: x.length / numValues,
      title: clusterTitle(i, arr.length),
    };
  });
};
