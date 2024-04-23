import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useDates } from "shared/hooks/use-dates";
import { Scenario } from "shared/models/scenario";
import { store } from "shared/store";
import { scenarioStore } from "shared/store/scenario-store";
import { clusterTitle, getClusterCount } from "shared/utility/cluster-helpers";
import { ckmeans, median, sumSimple } from "simple-statistics";
import { useFutureMortgageEquity } from "./use-future-mortgage-equity";
import { useFutureRetirementContributions } from "./use-future-retirement-contributions";
import { useFutureSavings } from "./use-future-savings";

const isFuture = (date: DateTime) => date.diffNow("milliseconds").milliseconds > 0;
const thresholdTaxRemaining = (taxRate: number, threshold: number, scenario: Scenario) => {
  const remaining = scenario.payments
    .slice(scenario.currentPaymentIdx)
    .filter((x) => x.cumulative >= threshold)
    .reduce((acc, curr) => {
      return acc + Math.min(curr.value, curr.cumulative - threshold) * taxRate;
    }, 0);
  return remaining;
};

export const useFutureTotals = (year: number) => {
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);
  const bonusTakehomeFactor = useStore(store, (x) => 1 - x.projectedWealth.bonusWitholdingsRate);
  const savings = useFutureSavings(year);
  const homeEquity = useFutureMortgageEquity(year);
  const retirement = useFutureRetirementContributions(year);
  const config = useStore(store, (x) => x.projectedWealth);

  const dates = useDates(year);
  const rawClusters = useMemo(() => {
    const totals = scenarios?.map((x) => {
      const futureBonuses = [
        isFuture(dates.meritBonus) && x.meritBonus * bonusTakehomeFactor,
        isFuture(dates.companyBonus) && x.companyBonus * bonusTakehomeFactor,
        isFuture(dates.retirementBonus) && x.retirementBonus,
        thresholdTaxRemaining(config.socialSecurityTaxRate, config.socialSecurityLimit, x),
        thresholdTaxRemaining(-1 * config.medicareSupplementalTaxRate, config.medicareSupplementalTaxThreshold, x),
      ].filter((x) => x) as number[];
      return sumSimple(futureBonuses);
    });
    if (!totals || totals.length === 0) {
      return [[savings.remaining + retirement.remaining]];
    }
    const clusters = ckmeans(totals, getClusterCount(totals?.length));
    return clusters.map((x) => x.map((y) => y + savings.remaining + retirement.remaining + homeEquity));
  }, [
    bonusTakehomeFactor,
    config.medicareSupplementalTaxRate,
    config.medicareSupplementalTaxThreshold,
    config.socialSecurityLimit,
    config.socialSecurityTaxRate,
    dates.companyBonus,
    dates.meritBonus,
    dates.retirementBonus,
    homeEquity,
    retirement.remaining,
    savings.remaining,
    scenarios,
  ]);

  return useMemo(() => {
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
  }, [rawClusters]);
};
