import { useMemo } from "react";
import { ckmeans } from "simple-statistics";
import { useScenarios } from "./use-scenarios";

const clusterTitle = (index: number, length: number) => {
  if (length === 1) {
    return "Actual";
  } else if (length == 2) {
    return ["Low", "High"][index];
  } else {
    return ["Low", "Med", "High"][index];
  }
};

export interface Cluster {
  min: number;
  max: number;
  probability: number;
  title: string;
}

const clusters = (values: number[]): Cluster[] => {
  return ckmeans(values, Math.min(3, values.length)).map((x, i, arr) => {
    return {
      min: Math.min(...x),
      max: Math.max(...x),
      probability: x.length / values.length,
      title: clusterTitle(i, arr.length),
    };
  });
};

export const useClusters = (year: number) => {
  const scenarios = useScenarios(year);

  return useMemo(() => {
    if (scenarios.length === 0) {
      return {
        totalPay: [],
        meritBonus: [],
        retirementBonus: [],
        companyBonus: [],
        pay: [],
        meritIncrease: [],
        scenarios,
      };
    }
    return {
      totalPay: clusters(scenarios.map((x) => x.totalPay)),
      meritBonus: clusters(scenarios.map((x) => x.meritBonus)),
      retirementBonus: clusters(scenarios.map((x) => x.retirementBonus)),
      companyBonus: clusters(scenarios.map((x) => x.companyBonus)),
      pay: clusters(scenarios.map((x) => x.pay.at(-1)?.value ?? 0)),
      meritIncrease: clusters(scenarios.map((x) => x.meritIncreasePct + x.equityIncreasePct)),
      scenarios,
    };
  }, [scenarios]);
};
