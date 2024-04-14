import { Cluster } from "capabilities/projected-income/hooks/use-gradient";

export const scaleCluster = (cluster: Cluster | undefined, factor: number) => {
  if (!cluster) {
    return undefined;
  }
  return { ...cluster, min: cluster.min * factor, max: cluster.max * factor, median: cluster.median * factor };
};

export const scaleClusters = (clusters: Cluster[] | undefined, factor: number): Cluster[] | undefined => {
  return clusters?.filter((x) => x).map((x) => scaleCluster(x, factor)!);
};

export const findMostMostLikely = (cluster: Cluster[]) => {
  if (cluster.length === 0) {
    return;
  }
  const mostLikely = cluster.reduce((acc, curr) => {
    return acc.probability > curr.probability ? acc : curr;
  });
  return mostLikely;
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
        const mostLikely = findMostMostLikely(curr);

        acc.max += mostLikely?.max ?? 0;
        acc.min += mostLikely?.min ?? 0;
        acc.median += mostLikely?.median ?? 0;
        return acc;
      },
      { min: 0, max: 0, median: 0, title: "Actual", probability: 0 }
    ),
  ];
};
