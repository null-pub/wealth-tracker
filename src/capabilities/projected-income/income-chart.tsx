import { AgCartesianChartOptions, AgLineSeriesOptions } from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useTotalPayClusters } from "shared/hooks/use-clusters";
import { getLocalDateTime } from "shared/utility/current-date";
import { formatCash, formatCashShort } from "shared/utility/format-cash";
import { formatPercent } from "shared/utility/format-percent";

const getColor = (probability?: number) => {
  if (!probability) {
    return "inherit";
  }
  if (probability >= 0.5) {
    return "green";
  }
  if (probability >= 0.25) {
    return "orange";
  }
  return "rgb(244, 67, 54)";
};

export const IncomeChart = () => {
  const clusters = useTotalPayClusters();
  const history = useMemo(() => {
    return clusters
      .filter(([year]) => +year <= getLocalDateTime().year)
      .map(([year, x]) => ({
        totalPay: x[0]?.median ?? 0,
        date: DateTime.fromObject({ year: +year, month: 1, day: 1 }).toJSDate(),
      }));
  }, [clusters]);

  const future = useMemo(() => {
    return clusters
      .filter(([year]) => +year >= getLocalDateTime().year)
      .map(([year, x]) => {
        const data = Object.fromEntries(
          x?.flatMap((x) => {
            const title = x.title.toLocaleLowerCase();
            return [
              [title, x.median],
              [title + "Probability", x.probability],
            ];
          })
        );
        return {
          ...data,
          date: DateTime.fromObject({ year: +year, month: 1, day: 1 }).toJSDate(),
        };
      });
  }, [clusters]);

  const series = useMemo(() => {
    return [
      {
        type: "line",
        xKey: "date",
        yKey: "totalPay",
        data: history,
        yName: "Income",

        tooltip: {
          renderer: ({ datum, yKey, xKey }) => ({
            content: `${DateTime.fromJSDate(datum[xKey]).year} ${formatCashShort(datum[yKey])}`,
          }),
        },
      },
      {
        type: "line",
        xKey: "date",
        yKey: "low",
        data: future,
        yName: "Low",
        stroke: "grey",
        marker: {
          formatter: (params) => {
            const color = getColor(params.datum.lowProbability);
            return {
              fill: color,
              stroke: color,
            };
          },
        },
        tooltip: {
          renderer: ({ datum, yKey, xKey }) => ({
            content: `${DateTime.fromJSDate(datum[xKey]).year} ${formatCashShort(datum[yKey])} ${formatPercent(datum.lowProbability)}`,
          }),
        },
      },
      {
        marker: {
          formatter: (params) => {
            const color = getColor(params.datum.medProbability);
            return {
              fill: color,
            };
          },
        },
        type: "line",
        stroke: "grey",
        xKey: "date",
        yKey: "med",
        data: future,
        yName: "Medium",
        tooltip: {
          renderer: ({ datum, yKey, xKey }) => ({
            content: `${DateTime.fromJSDate(datum[xKey]).year} ${formatCashShort(datum[yKey])} ${formatPercent(datum.medProbability)}`,
          }),
        },
      },
      {
        stroke: "grey",
        marker: {
          formatter: (params) => {
            const color = getColor(params.datum.highProbability);
            return {
              fill: color,
              stroke: color,
            };
          },
        },
        type: "line",
        xKey: "date",
        yKey: "high",
        data: future,
        yName: "High",
        tooltip: {
          renderer: ({ datum, yKey, xKey }) => ({
            content: `${DateTime.fromJSDate(datum[xKey]).year} ${formatCashShort(datum[yKey])} ${formatPercent(datum.highProbability)}`,
          }),
        },
      },
    ] as AgLineSeriesOptions[];
  }, [future, history]);

  const options: AgCartesianChartOptions = useMemo(
    () => ({
      theme: "ag-default-dark",
      title: {
        text: `Income`,
      },

      axes: [
        {
          type: "time",
          position: "bottom",
          label: {
            format: "%Y",
          },
          nice: false,
        },
        {
          type: "number",
          position: "left",
          nice: false,
          tick: {
            maxSpacing: 40,
          },
          label: {
            formatter: (params) => {
              return formatCash(params.value);
            },
          },
        },
      ],
      series,
    }),
    [series]
  );
  return <AgChartsReact options={options} />;
};
