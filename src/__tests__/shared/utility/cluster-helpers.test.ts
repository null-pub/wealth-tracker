import { Cluster } from "shared/hooks/use-clusters";
import {
  clusterTitle,
  findMostMostLikely,
  getClusterCount,
  scaleCluster,
  scaleClusters,
  SumClusters,
} from "shared/utility/cluster-helpers";
import { describe, expect, it } from "vitest";

describe("cluster-helpers", () => {
  describe("scaleCluster", () => {
    it("should scale a cluster's numeric values", () => {
      const cluster: Cluster = {
        min: 100,
        max: 200,
        median: 150,
        probability: 0.5,
        title: "Test",
      };
      const scaled = scaleCluster(cluster, 2);
      expect(scaled).toEqual({
        min: 200,
        max: 400,
        median: 300,
        probability: 0.5,
        title: "Test",
      });
    });

    it("should handle undefined input", () => {
      expect(scaleCluster(undefined, 2)).toBeUndefined();
    });
  });

  describe("scaleClusters", () => {
    it("should scale an array of clusters", () => {
      const clusters: Cluster[] = [
        { min: 100, max: 200, median: 150, probability: 0.5, title: "Low" },
        { min: 200, max: 300, median: 250, probability: 0.5, title: "High" },
      ];
      const scaled = scaleClusters(clusters, 2);
      expect(scaled).toEqual([
        { min: 200, max: 400, median: 300, probability: 0.5, title: "Low" },
        { min: 400, max: 600, median: 500, probability: 0.5, title: "High" },
      ]);
    });

    it("should handle undefined input", () => {
      expect(scaleClusters(undefined, 2)).toBeUndefined();
    });
  });

  describe("findMostMostLikely", () => {
    it("should find cluster with highest probability", () => {
      const clusters: Cluster[] = [
        { min: 100, max: 200, median: 150, probability: 0.3, title: "Low" },
        { min: 200, max: 300, median: 250, probability: 0.7, title: "High" },
      ];
      const mostLikely = findMostMostLikely(clusters);
      expect(mostLikely).toEqual(clusters[1]);
    });

    it("should handle empty array", () => {
      expect(findMostMostLikely([])).toBeUndefined();
    });
  });

  describe("clusterTitle", () => {
    it("should return 'Actual' for length 1", () => {
      expect(clusterTitle(0, 1)).toBe("Actual");
    });

    it("should return Low/High for length 2", () => {
      expect(clusterTitle(0, 2)).toBe("Low");
      expect(clusterTitle(1, 2)).toBe("High");
    });

    it("should return Low/Med/High for length 3", () => {
      expect(clusterTitle(0, 3)).toBe("Low");
      expect(clusterTitle(1, 3)).toBe("Med");
      expect(clusterTitle(2, 3)).toBe("High");
    });
  });

  describe("getClusterCount", () => {
    it("should return count of unique values up to 2", () => {
      const values = [1, 1, 2];
      expect(getClusterCount(values, (x) => x)).toBe(2);
    });

    it("should return 2 for 4 unique values", () => {
      const values = [1, 2, 3, 4];
      expect(getClusterCount(values, (x) => x)).toBe(2);
    });

    it("should return 3 for 3 or 5+ unique values", () => {
      expect(getClusterCount([1, 2, 3], (x) => x)).toBe(3);
      expect(getClusterCount([1, 2, 3, 4, 5], (x) => x)).toBe(3);
    });
  });

  describe("SumClusters", () => {
    it("should sum multiple cluster arrays", () => {
      const clusters: Cluster[][] = [
        [
          { min: 100, max: 200, median: 150, probability: 0.5, title: "Low" },
          { min: 200, max: 300, median: 250, probability: 0.5, title: "High" },
        ],
        [
          { min: 50, max: 100, median: 75, probability: 0.6, title: "Low" },
          { min: 150, max: 200, median: 175, probability: 0.4, title: "High" },
        ],
      ];
      const summed = SumClusters(clusters);
      expect(summed).toEqual([
        { min: 150, max: 300, median: 225, probability: 0.55, title: "Low" },
        { min: 350, max: 500, median: 425, probability: 0.45, title: "High" },
      ]);
    });

    it("should handle empty input", () => {
      expect(SumClusters([])).toEqual([]);
    });

    it("should handle single cluster arrays", () => {
      const clusters: Cluster[][] = [[{ min: 100, max: 200, median: 150, probability: 1, title: "Actual" }]];
      const summed = SumClusters(clusters);
      expect(summed).toEqual([{ min: 100, max: 200, median: 150, probability: 1, title: "Actual" }]);
    });

    it("should handle mixed length arrays", () => {
      const clusters: Cluster[][] = [
        [
          { min: 100, max: 200, median: 150, probability: 0.5, title: "Low" },
          { min: 200, max: 300, median: 250, probability: 0.5, title: "High" },
        ],
        [{ min: 100, max: 200, median: 150, probability: 1, title: "Actual" }],
      ];
      const summed = SumClusters(clusters);
      expect(summed.length).toBe(2);
      expect(summed[0].min).toBe(200);
      expect(summed[1].min).toBe(300);
    });
  });
});
