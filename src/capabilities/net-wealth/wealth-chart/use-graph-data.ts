import { useStore } from "@tanstack/react-store";
import { store } from "shared/store";
import { getGraphValue } from "shared/utility/get-graph-value";
import { useGraphDates } from "shared/utility/use-graph-dates";

export type GraphData = {
  total: number;
  date: Date;
} & Record<string, number | null>;

export const useGraphData = () => {
  const wealth = useStore(store, (x) => x.wealth);
  const dates = useGraphDates(Object.values(wealth));
  const accounts = Object.entries(wealth);

  const graphData = dates.map((date) => {
    return accounts.reduce(
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
  });

  graphData.forEach((graphEntry, index, arr) => {
    if (index < arr.length - 1) {
      Object.keys(graphEntry).forEach((key) => {
        if (graphEntry[key] === null && arr[index + 1][key] !== null) {
          graphEntry[key] = 0;
        }
      });
    }
  });

  const firstNonZero = graphData.findIndex((x) => (x["total"] as number) > 0);
  return graphData.slice(firstNonZero);
};
