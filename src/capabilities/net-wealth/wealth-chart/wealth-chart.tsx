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
import { GraphData, useGraphData } from "./use-graph-data";

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

  const series = [
    ...Object.entries(wealth).map(([x, data]) => {
      return {
        stacked: true,
        type: "area",
        xKey: "date",
        yKey: x,
        yName: `${x}${data.hidden ? " (hidden)" : ""}`,
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
      tooltip: {
        renderer: ({ datum, yKey }) => ({
          heading: DateTime.fromJSDate(datum.date).toFormat(shortDate),
          data: [{ label: yKey, value: `${formatCash(datum.total)} ${formatDeltaCash(datum.delta)}` }],
        }),
      },
    } as AgLineSeriesOptions<GraphData>,
  ];

  const options: AgCartesianChartOptions = {
    theme: "ag-default-dark",
    title: {
      text: `Total Wealth ${formatCash((data[data.length - 1]?.total ?? 0) as number)}`,
    },

    data: filteredData,
    axes: [
      {
        type: "time",
        position: "bottom",
        label: {
          format: "%Y",
        },
        nice: false,
        interval: {
          step: time.year.every(1, { snapTo: "start" }),
        },
      },
      {
        type: "number",
        position: "left",
      },
    ],
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
