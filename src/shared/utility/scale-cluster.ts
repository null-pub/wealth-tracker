import { Cluster } from "capabilities/projected-income/hooks/use-gradient";

export const scaleCluster = (cluster: Cluster, factor: number) => {
  return { ...cluster, min: cluster.min * factor, max: cluster.max * factor };
};

export const scaleClusters = (clusters: Cluster[], factor: number) => {
  return clusters.map((x) => scaleCluster(x, factor));
};
