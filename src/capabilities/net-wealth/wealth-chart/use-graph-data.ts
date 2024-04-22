import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { store } from "shared/store";
import { getGraphDates } from "shared/utility/get-graph-dates";
import { getGraphValue } from "shared/utility/get-graph-value";

export const useGraphData = () => {
  const wealth = useStore(store, (x) => x.wealth);

  return useMemo(() => {
    const dates = getGraphDates(Object.values(wealth));
    const accounts = Object.entries(wealth);
    const graphData = dates.map((date) => {
      return accounts.reduce(
        (acc, [accountName, account]) => {
          const value = getGraphValue(date, account);

          if (value) {
            acc[accountName] = value;
            acc["total"] = (acc["total"] as number) + value;
          } else {
            acc[accountName] = null;
          }

          acc["date"] = date.toJSDate();
          return acc;
        },
        { total: 0 } as Record<string, number | Date | null>
      );
    });

    graphData.forEach((x, idx, arr) => {
      if (idx < arr.length - 1) {
        Object.keys(x).forEach((key) => {
          if (x[key] === null && arr[idx + 1][key] !== null) {
            x[key] = 0;
          }
        });
      }
    });

    const firstNonZero = graphData.findIndex((x) => (x["total"] as number) > 0);
    return graphData.slice(firstNonZero);
  }, [wealth]);
};
