import { AgCartesianChartOptions, AgLineSeriesOptions } from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { getLocalDateTime } from "shared/utility/current-date";
import { formatCash, formatCashShort } from "shared/utility/format-cash";
import { shortDate } from "shared/utility/format-date";
import { TimeSeriesWealth, useTimeSeriesWealth } from "./hooks/use-times-series-wealth";

interface MarkerParams<T> {
  fill: string;
  fillOpacity: number;
  highlighted: boolean;
  seriesId: string;
  size: number;
  stroke: string;
  strokeOpacity: number;
  strokeWidth: number;
  xKey: string;
  yKey: string;
  datum: T;
}

export const WealthChart = (props: { titleYear: number }) => {
  const dataYear = getLocalDateTime().year + 1;
  const { titleYear } = props;
  const data = useTimeSeriesWealth(dataYear);
  const offsetIdx = getLocalDateTime().year - titleYear + 1;

  const series = useMemo(() => {
    return [
      {
        type: "line",
        xKey: "graphDate",
        yKey: "wealth",
        yName: "Wealth",
        tooltip: {
          renderer: ({ datum, yKey, xKey }) => ({
            content: `${DateTime.fromJSDate(datum[xKey]).toISODate()} ${formatCash(datum[yKey])}`,
          }),
        },
        marker: {
          formatter: (params: MarkerParams<TimeSeriesWealth>) => {
            if (params.datum.date.year === DateTime.local().plus({ years: 1 }).year) {
              return {
                fill: "orange",
              };
            } else if (params.datum.date.year === DateTime.local().plus({ years: 2 }).year) {
              return {
                fill: "rgb(244, 67, 54)",
              };
            } else if (params.datum.date.hasSame(DateTime.local(), "day")) {
              return {
                fill: "green",
              };
            }
          },
        },
      },
      {
        type: "line",
        xKey: "graphDate",
        yKey: "yoyCash",
        yName: "YoY ($)",
        stroke: "grey",

        tooltip: {
          renderer: ({ datum, yKey, xKey }) => ({
            content: `${DateTime.fromJSDate(datum[xKey]).toISODate()} ${formatCash(datum[yKey])}`,
          }),
        },
        marker: {
          fill: "grey",
          formatter: (params: MarkerParams<TimeSeriesWealth>) => {
            if (params.datum.date.year === DateTime.local().plus({ years: 1 }).year) {
              return {
                fill: "orange",
              };
            } else if (params.datum.date.year === DateTime.local().plus({ years: 2 }).year) {
              return {
                fill: "rgb(244, 67, 54)",
              };
            } else if (params.datum.date.hasSame(DateTime.local(), "day")) {
              return {
                fill: "green",
              };
            }
          },
        },
      },
    ] as AgLineSeriesOptions[];
  }, []);

  const options: AgCartesianChartOptions = useMemo(
    () => ({
      theme: "ag-default-dark",
      title: {
        text: `${data[data.length - 1 - offsetIdx].date.toFormat(shortDate)} Projected wealth ${formatCashShort(
          (data[data.length - 1 - offsetIdx]?.wealth ?? 0) as number
        )}`,
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
          nice: false,
        },
      ],
      series,
    }),
    [data, series, offsetIdx]
  );
  return <AgChartsReact options={options} />;
};
