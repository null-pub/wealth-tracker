import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { scenarioStore } from "shared/store/scenario-store";
import { clusterTitle, getClusterCount } from "shared/utility/cluster-helpers";
import { ckmeans, median } from "simple-statistics";

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

  const clusters = ckmeans(values, getClusterCount(values.length)).map((x, i, arr) => {
    return {
      min: Math.min(...x),
      max: Math.max(...x),
      median: median(x),
      probability: x.length / values.length,
      title: clusterTitle(i, arr.length),
    };
  });
  for (let i = 0; i < clusters.length; i++) {
    if (i < clusters.length - 1 && clusters[i].min === clusters[i + 1].min && clusters[i].max === clusters[i + 1].max) {
      clusters[i + 1].probability += clusters[i].probability;
      clusters.splice(i, 1);
    }
  }
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
      totalPay: clusters(scenarios?.map((x) => x.totalPay)),
      meritBonus: clusters(scenarios?.map((x) => x.meritBonus)),
      retirementBonus: clusters(scenarios?.map((x) => x.retirementBonus)),
      companyBonus: clusters(scenarios?.map((x) => x.companyBonus)),
      pay: clusters(scenarios?.map((x) => x.pay.at(-1)?.value ?? 0)),
      meritIncrease: clusters(scenarios?.map((x) => x.meritIncreasePct + x.equityIncreasePct)),
      taxablePay: clusters(scenarios?.map((x) => x.taxablePay)),
      scenarios,
    };
  }, [scenarios]);
};
