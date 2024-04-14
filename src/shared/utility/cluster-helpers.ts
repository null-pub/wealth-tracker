import { Cluster } from "capabilities/projected-income/hooks/use-gradient";

export const scaleCluster = (cluster: Cluster, factor: number) => {
  return { ...cluster, min: cluster.min * factor, max: cluster.max * factor };
};

export const scaleClusters = (clusters: Cluster[], factor: number) => {
  return clusters.map((x) => scaleCluster(x, factor));
};

export const ExpectedValue = (Clusers: Cluster[][]) => {
  if (Clusers.length == 0) {
    return [];
  }

  return [
    Clusers.reduce(
      (acc, curr) => {
        if (curr.length === 0) {
          return acc;
        }
        const mostLikely = curr.reduce((acc, curr) => {
          return acc.probability > curr.probability ? acc : curr;
        });

        acc.max += mostLikely.max;
        acc.min += mostLikely.min;
        return acc;
      },
      { min: 0, max: 0, title: "Actual", probability: 0 }
    ),
  ];
};
