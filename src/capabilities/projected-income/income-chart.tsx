import InsertChartIcon from "@mui/icons-material/InsertChart";
import { Tooltip } from "@mui/material";
import { AgCartesianChartOptions, AgLineSeriesOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { DateTime } from "luxon";
import { useTotalPayClusters } from "shared/hooks/use-clusters";
import { getLocalDateTime } from "shared/utility/current-date";
import { formatCash, formatCashShort } from "shared/utility/format-cash";
import { shortDate } from "shared/utility/format-date";
import { formatPercent } from "shared/utility/format-percent";
import { getProbablityColor } from "shared/utility/get-probablity-color";

export const IncomeChart = () => {
  const clusters = useTotalPayClusters();
  const history = clusters
    .filter(([year]) => +year <= getLocalDateTime().year)
    .map(([year, x]) => ({
      totalPay: x[0]?.median ?? 0,
      date: DateTime.fromObject({ year: +year, month: 1, day: 1 }).toJSDate(),
    }));

  const future = clusters
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

  const isDisabled = future.length + history.length === 0;

  const series = [
    {
      type: "line",
      xKey: "date",
      yKey: "totalPay",
      data: history,
      yName: "Income",

      tooltip: {
        renderer: ({ datum, yKey, xKey }) => ({
          heading: DateTime.fromJSDate(datum[xKey]).toFormat(shortDate),
          data: [{ label: yKey, value: formatCashShort(datum[yKey]) }],
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
        itemStyler: (params) => {
          const color = getProbablityColor(params.datum.lowProbability);
          return {
            fill: color,
            stroke: color,
          };
        },
      },
      tooltip: {
        renderer: ({ datum, yKey, xKey }) => ({
          heading: DateTime.fromJSDate(datum[xKey]).year,
          data: [{ label: yKey, value: `${formatCashShort(datum[yKey])} ${formatPercent(datum.lowProbability)}` }],
        }),
      },
    },
    {
      marker: {
        itemStyler: (params) => {
          const color = getProbablityColor(params.datum.medProbability);
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
          heading: DateTime.fromJSDate(datum[xKey]).year,
          data: [{ label: yKey, value: `${formatCashShort(datum[yKey])} ${formatPercent(datum.medProbability)}` }],
        }),
      },
    },
    {
      stroke: "grey",
      marker: {
        itemStyler: (params) => {
          const color = getProbablityColor(params.datum.highProbability);
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
          heading: DateTime.fromJSDate(datum[xKey]).year,
          data: [{ label: yKey, value: `${formatCashShort(datum[yKey])} ${formatPercent(datum.highProbability)}` }],
        }),
      },
    },
  ] as AgLineSeriesOptions[];

  const options: AgCartesianChartOptions = {
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
        nice: true,
        interval: {
          maxSpacing: 45,
        },
        label: {
          formatter: (params) => {
            return formatCash(params.value);
          },
        },
      },
    ],
    series,
  };

  return (
    <Tooltip
      disableHoverListener={isDisabled}
      disableFocusListener={isDisabled}
      disableTouchListener={isDisabled}
      slotProps={{
        tooltip: {
          sx: {
            maxWidth: "unset",
          },
        },
      }}
      title={<AgCharts options={options} css={{ height: 375, width: 750 }} />}
    >
      <InsertChartIcon color={isDisabled ? "disabled" : undefined} />
    </Tooltip>
  );
};
