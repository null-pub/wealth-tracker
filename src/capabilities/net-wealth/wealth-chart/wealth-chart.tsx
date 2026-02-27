import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { AgAreaSeriesOptions, AgCartesianChartOptions, AgChartInstance, AgLineSeriesOptions, time } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { useEarliestAccountEntry } from "shared/hooks/use-earliest-account-entry";
import { store } from "shared/store";
import { useLocalDateTime } from "shared/utility/current-date";
import { formatCash, formatDeltaCash } from "shared/utility/format-cash";
import { shortDate } from "shared/utility/format-date";
import { formatPercentSigns } from "shared/utility/format-percent";
import { GraphData, useGraphData } from "./use-graph-data";

const makeTooltipHtml = (
  title: string,
  rows: Array<{ label: string; cash: string; percent?: string; colorCash?: boolean } | undefined>
): string => {
  const filteredRows = rows.filter((x): x is { label: string; cash: string; percent?: string; colorCash?: boolean } => !!x);
  const tableRows = filteredRows
    .map(({ label, cash, percent, colorCash }) => {
      const deltaColor = (val: string) => (val.startsWith("-") ? "#f87171" : "#4ade80");
      const cashStyle = `text-align:right;padding:2px 4px${colorCash ? `;color:${deltaColor(cash)}` : ""}`;
      const percentColor = percent === undefined ? "" : deltaColor(percent);
      return `<tr>
        <td style="text-align:left;padding:2px 8px 2px 0">${label}</td>
        <td style="${cashStyle}">${cash}</td>
        ${percent !== undefined ? `<td style="text-align:right;padding:2px 0 2px 4px;color:${percentColor}">${percent}</td>` : ""}
      </tr>`;
    })
    .join("");
  return `<div style="padding:8px 12px;font-variant-numeric:tabular-nums">
    <div style="font-weight:bold;margin-bottom:6px">${title}</div>
    <table style="width:100%;border-collapse:collapse">${tableRows}</table>
  </div>`;
};

export const WealthChart = () => {
  const wealth = useStore(store, (x) => x.wealth);
  const [hidden, setHidden] = useState<string[]>([]);
  const data = useGraphData(hidden);
  const initialFromDate = useEarliestAccountEntry().startOf("year");
  const localTime = useLocalDateTime();
  const intialToDate = localTime.endOf("year");
  const [fromDate, setFromDate] = useState<DateTime>(localTime.plus({ year: -1 }));
  const [toDate, setToDate] = useState<DateTime>(intialToDate);
  const ref = useRef<AgChartInstance>(null);

  const filteredData = data.filter((x) => {
    const year = x.date?.getFullYear();
    return year && year >= fromDate.year && year <= toDate.year;
  });

  const getYearStartTotal = (date: Date) => {
    const year = date.getFullYear();
    const firstInYear = filteredData.find((x) => x.date?.getFullYear() === year);
    return firstInYear?.total ?? 0;
  };

  const getRangeStartTotal = () => filteredData[0]?.total ?? 0;
  const getRangeStartDate = () => filteredData[0]?.date;

  const getMaxTotalUpTo = (date: Date) => {
    const targetTime = date.getTime();
    let max = -Infinity;

    filteredData.forEach((point) => {
      if (point.date && point.date.getTime() <= targetTime) {
        max = Math.max(max, point.total ?? 0);
      }
    });

    return max === -Infinity ? 0 : max;
  };

  const series = [
    ...Object.entries(wealth).map(([x, data]) => {
      return {
        stacked: true,
        type: "area",
        xKey: "date",
        yKey: x,
        yName: `${x}${data.hidden ? " (hidden)" : ""}`,
        highlight: {
          enabled: false,
        },
        tooltip: {
          renderer: ({ datum, yKey, xKey }) => ({
            heading: DateTime.fromJSDate(datum[xKey]).toFormat(shortDate),
            data: [{ label: yKey, value: formatCash(datum[yKey]) }],
          }),
        },
      } as AgAreaSeriesOptions;
    }),
    {
      type: "line",
      xKey: "date",
      yKey: "total",
      yName: "Total",
      highlight: {
        enabled: false,
      },
      tooltip: {
        renderer: ({ datum }) => {
          const ath = datum.total - getMaxTotalUpTo(datum.date);
          const rangeStartDate = getRangeStartDate();
          const rangeStartIso = rangeStartDate ? DateTime.fromJSDate(rangeStartDate).toISODate() : undefined;
          const yearStartIso = DateTime.fromJSDate(datum.date).startOf("year").toISODate();
          const isRangeStartSameAsYearStart = rangeStartIso && rangeStartIso === yearStartIso;
          const currentYearStart = localTime.startOf("year");
          const isBeforeCurrentYearStart = DateTime.fromJSDate(datum.date) < currentYearStart;
          return makeTooltipHtml(DateTime.fromJSDate(datum.date).toFormat(shortDate), [
            { label: "Total", cash: formatCash(datum.total) },
            {
              label: "Since Last",
              cash: formatDeltaCash(datum.delta),
              percent: formatPercentSigns(datum.delta / datum.total),
              colorCash: true,
            },
            !isRangeStartSameAsYearStart
              ? {
                  label: "Since Range Start",
                  cash: formatDeltaCash(datum.total - getRangeStartTotal()),
                  percent: formatPercentSigns((datum.total - getRangeStartTotal()) / datum.total),
                  colorCash: true,
                }
              : undefined,
            !isBeforeCurrentYearStart
              ? {
                  label: "YTD",
                  cash: formatDeltaCash(datum.total - getYearStartTotal(datum.date)),
                  percent: formatPercentSigns((datum.total - getYearStartTotal(datum.date)) / datum.total),
                  colorCash: true,
                }
              : undefined,
            ath < 0
              ? {
                  label: "Since ATH",
                  cash: formatDeltaCash(datum.total - getMaxTotalUpTo(datum.date)),
                  percent: formatPercentSigns((datum.total - getMaxTotalUpTo(datum.date)) / datum.total),
                  colorCash: true,
                }
              : undefined,
          ]);
        },
      },
    } as AgLineSeriesOptions<GraphData>,
  ];

  const options: AgCartesianChartOptions = {
    theme: "ag-default-dark",
    title: {
      text: `Total Wealth ${formatCash((data[data.length - 1]?.total ?? 0) as number)}`,
    },

    data: filteredData,
    axes: {
      x: {
        type: "time",
        position: "bottom",
        label: {
          format: "%Y",
        },

        nice: false,
        interval: {
          step: time.year.every(1),
        },
      },
      y: {
        type: "number",
        position: "left",
      },
    },
    series,
    legend: {
      listeners: {
        legendItemClick: () => {
          setTimeout(() => {
            setHidden(
              ref.current
                ?.getState()
                .legend?.filter((x) => !x.visible)
                .map((x) => x.itemId as string) ?? []
            );
          }, 1);
        },
      },
    },
  };

  return (
    <Box position={"relative"} height="100%" width="100%">
      <AgCharts ref={ref} options={options} css={{ height: "100%", width: "100%" }} />
      <Box
        position={"absolute"}
        top={16}
        right={16}
        zIndex={100}
        width={250}
        padding={1.5}
        borderRadius={4}
        bgcolor={"rgba(0,0,0,.5)"}
        display={"flex"}
        gap={2}
        sx={{
          transition: "opacity 150ms",
          "&:hover": {
            opacity: "100%",
          },
          opacity: "35%",
        }}
      >
        <DatePicker
          sx={{ backgroundColor: "#121212" }}
          views={["year"]}
          label="From"
          minDate={initialFromDate}
          maxDate={intialToDate}
          value={fromDate}
          onChange={(value) => {
            value && setFromDate(value);
          }}
        />
        <DatePicker
          label="To"
          sx={{ backgroundColor: "#121212" }}
          views={["year"]}
          value={toDate}
          minDate={initialFromDate}
          maxDate={intialToDate}
          onChange={(value) => {
            value && setToDate(value);
          }}
        />
      </Box>
    </Box>
  );
};
