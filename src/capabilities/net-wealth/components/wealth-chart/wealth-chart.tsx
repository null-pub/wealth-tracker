import { useStore } from "@tanstack/react-store";
import { AgAreaSeriesOptions, AgCartesianChartOptions, AgLineSeriesOptions } from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { formatCashShort } from "shared/utility/format-cash";
import { useGraphData } from "./use-graph-data";

export const WealthChart = () => {
  const wealth = useStore(store, (x) => x.wealth);
  const data = useGraphData();

  const series = useMemo(() => {
    return [
      ...Object.keys(wealth).map((x) => {
        return {
          stacked: true,
          type: "area",
          xKey: "date",
          yKey: x,
          yName: x,
          tooltip: {
            renderer: ({ datum, yKey, xKey }) => ({
              content: `${DateTime.fromJSDate(datum[xKey]).toISODate()} ${formatCashShort(datum[yKey])}`,
            }),
          },
        } as AgAreaSeriesOptions;
      }),
      {
        type: "line",
        xKey: "date",
        yKey: "total",
        yName: "Total",
        tooltip: {
          renderer: ({ datum, yKey, xKey }) => ({
            content: `${DateTime.fromJSDate(datum[xKey]).toISODate()} ${formatCashShort(datum[yKey])}`,
          }),
        },
      } as AgLineSeriesOptions,
    ];
  }, [wealth]);

  const options: AgCartesianChartOptions = useMemo(
    () => ({
      theme: "ag-default-dark",
      title: {
        text: `Total Wealth ${formatCashShort((data[data.length - 1]?.total ?? 0) as number)}`,
      },
      data,
      axes: [
        {
          type: "time",
          position: "bottom",
          label: {
            format: "%Y",
          },
        },
        {
          type: "number",
          position: "left",
        },
      ],
      series,
    }),
    [data, series]
  );
  return <AgChartsReact options={options} />;
};
