import { useStore } from "@tanstack/react-store";
import { store } from "shared/store";
import { getGraphValue } from "shared/utility/get-graph-value";
import { useGraphDates } from "shared/utility/use-graph-dates";

export type GraphData = {
  total: number;
  date: Date;
  delta: number;
} & Record<string, number | null>;

export const useGraphData = (visibleIds: string[]) => {
  const wealth = useStore(store, (x) => x.wealth);
  const dates = useGraphDates(Object.values(wealth));
  const accounts = Object.entries(wealth);

  const graphData = dates
    .map((date) => {
      return accounts
        .filter((x) => !visibleIds.includes(x[0]))
        .reduce(
          (acc, [accountName, account]) => {
            const value = getGraphValue(date, account);

            if (value) {
              acc[accountName] = value;
              acc.total = acc.total + value;
            } else {
              acc[accountName] = null;
            }

            acc.date = date.toJSDate();
            return acc;
          },
          { total: 0 } as GraphData
        );
    })
    .map((x, i, arr) => {
      return { ...x, delta: i == 0 ? 0 : x.total - arr[i - 1].total };
    });

  graphData.forEach((graphEntry, index, arr) => {
    if (index < arr.length - 1) {
      if (graphEntry.delta === null && arr[index + 1].delta !== null) {
        graphEntry.delta = 0;
      }
      if (graphEntry.total === null && arr[index + 1].total !== null) {
        graphEntry.total = 0;
      }
    }
  });

  const firstNonZero = graphData.findIndex((x) => x.total > 0);
  return graphData.slice(firstNonZero);
};
