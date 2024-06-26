import { Cluster } from "shared/hooks/use-clusters";

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
    return curr.probability > acc.probability ? curr : acc;
  });
  return mostLikely;
};

export const clusterTitle = (index: number, length: number) => {
  if (length === 1) {
    return "Actual";
  } else if (length == 2) {
    return ["Low", "High"][index];
  } else {
    return ["Low", "Med", "High"][index];
  }
};

export const getClusterCount = <T>(values: T[], selector: (x: T) => number) => {
  const uniqeValues = new Set(values.map((x) => selector(x))).size;

  if (uniqeValues < 3) {
    return uniqeValues;
  } else if (uniqeValues === 4) {
    return 2;
  }
  return 3;
};

export const SumClusters = (clusters: Cluster[][]) => {
  if (clusters.length == 0) {
    return [];
  }

  const numClusters = clusters.reduce((acc, curr) => Math.max(acc, curr.length), 0);
  const expandedClusters = clusters
    .filter((x) => x.length > 0)
    .map((cluster) => {
      if (cluster.length === 1) {
        return new Array(numClusters).fill(cluster[0]) as Cluster[];
      }
      if (cluster.length === 2 && numClusters === 3) {
        const min = cluster[0];
        const max = cluster[1];
        return [
          min,
          {
            min: (min.min + max.min) / 2,
            max: (min.max + max.max) / 2,
            median: (min.median + max.median) / 2,
            probability: (min.probability + max.probability) / 2,
            title: "Med",
          },
          max,
        ].map((x, _i, arr) => {
          const probability = x.probability / arr.reduce((acc, curr) => acc + curr.probability, 0);
          return { ...x, probability };
        }) as Cluster[];
      }
      return cluster;
    });

  return expandedClusters
    .reduce((acc, curr) => {
      return curr.map((x, i) => ({
        min: x.min + acc[i].min,
        max: x.max + acc[i].max,
        median: x.median + acc[i].median,
        probability: x.probability + acc[i].probability,
        title: x.title,
      }));
    })
    .map((x, _i, arr) => {
      const probability = x.probability / arr.reduce((acc, curr) => acc + curr.probability, 0);
      return { ...x, probability };
    })
    .map((x, i, arr) => {
      return { ...x, title: clusterTitle(i, arr.length) };
    });
};
