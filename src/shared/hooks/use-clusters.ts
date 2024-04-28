import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { scenarioStore } from "shared/store/scenario-store";
import { clusterTitle, getClusterCount } from "shared/utility/cluster-helpers";
import { ckmeans, max, median, min } from "simple-statistics";

export interface Cluster {
  min: number;
  max: number;
  median: number;
  probability: number;
  title: string;
}

const clusters = (values?: number[]): Cluster[] => {
  if (!values || values.length === 0) {
    return [];
  }

  const clusters = ckmeans(values, getClusterCount(values)).map((x, i, arr) => {
    return {
      min: min(x),
      max: max(x),
      median: median(x),
      probability: x.length / values.length,
      title: clusterTitle(i, arr.length),
    };
  });

  return clusters;
};

export const useClusters = (year: number) => {
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);

  return useMemo(() => {
    if (scenarios?.length === 0) {
      return {
        totalPay: [],
        meritBonus: [],
        retirementBonus: [],
        companyBonus: [],
        pay: [],
        meritIncrease: [],
        scenarios,
        taxablePay: [],
      };
    }
    return {
      totalPay: clusters(scenarios?.flatMap((x) => new Array(x.weight).fill(x.totalPay))),
      meritBonus: clusters(scenarios?.flatMap((x) => new Array(x.weight).fill(x.meritBonus))),
      retirementBonus: clusters(scenarios?.flatMap((x) => new Array(x.weight).fill(x.retirementBonus))),
      companyBonus: clusters(scenarios?.flatMap((x) => new Array(x.weight).fill(x.companyBonus))),
      pay: clusters(scenarios?.flatMap((x) => new Array(x.weight).fill(x.pay.at(-1)?.value ?? 0))),
      meritIncrease: clusters(
        scenarios?.flatMap((x) => new Array(x.weight).fill(x.meritIncreasePct + x.equityIncreasePct))
      ),
      taxablePay: clusters(scenarios?.flatMap((x) => new Array(x.weight).fill(x.taxablePay))),
      scenarios,
    };
  }, [scenarios]);
};

export const useTotalPayClusters = () => {
  const scenarios = useStore(scenarioStore, (x) => x.scenarios);
  return useMemo(() => {
    const allScenarios = Object.entries(scenarios);
    if (allScenarios.length === 0) {
      return [];
    }

    return allScenarios.map(([year, scenarios]) => {
      return [year, clusters(scenarios!.flatMap((x) => new Array(x.weight).fill(x.totalPay)))];
    }) as [string, Cluster[]][];
  }, [scenarios]);
};
