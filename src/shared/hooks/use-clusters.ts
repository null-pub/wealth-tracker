import { useStore } from "@tanstack/react-store";
import { Scenario } from "shared/models/scenario";
import { scenarioStore } from "shared/store/scenario-store";
import { ckmeans } from "shared/utility/ckmeans";
import { clusterTitle, getClusterCount } from "shared/utility/cluster-helpers";
import { max, median, min, sumSimple } from "simple-statistics";

export interface Cluster {
  min: number;
  max: number;
  median: number;
  probability: number;
  title: string;
}

const clusters = <T extends Scenario>(values: T[] | undefined, selector: (x: T) => number): Cluster[] => {
  if (!values || values.length === 0) {
    return [];
  }

  const totalWeight = sumSimple(values.map((x) => x.weight));
  const clusterCount = getClusterCount(values, selector);
  const clusters = ckmeans(values, clusterCount, selector);

  const result = clusters.map((x, i, arr) => {
    return {
      min: min(x.map((x) => selector(x))),
      max: max(x.map((x) => selector(x))),
      median: median(x.map((x) => selector(x))),
      probability: sumSimple(x.map((x) => x.weight)) / totalWeight,
      title: clusterTitle(i, arr.length),
    };
  });

  return result;
};

export const useClusters = (year: number) => {
  const scenarios = useStore(scenarioStore, (x) => x.scenarios[year]);

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
    totalPay: clusters(scenarios, (x) => x.totalPay),
    meritBonus: clusters(scenarios, (x) => x.meritBonus),
    retirementBonus: clusters(scenarios, (x) => x.retirementBonus),
    companyBonus: clusters(scenarios, (x) => x.companyBonus),
    pay: clusters(scenarios, (x) => x.pay.at(-1)?.value ?? 0),
    meritIncrease: clusters(scenarios, (x) => x.meritIncreasePct + x.equityIncreasePct),
    taxablePay: clusters(scenarios, (x) => x.taxablePay),
    scenarios,
  };
};

export const useTotalPayClusters = () => {
  const scenarios = useStore(scenarioStore, (x) => x.scenarios);
  const allScenarios = Object.entries(scenarios);
  if (allScenarios.length === 0) {
    return [];
  }

  return allScenarios.map(([year, scenarios]) => [year, clusters(scenarios, (x) => x.totalPay)]) as [string, Cluster[]][];
};
