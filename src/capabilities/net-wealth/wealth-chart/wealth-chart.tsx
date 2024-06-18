import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { AgAreaSeriesOptions, AgCartesianChartOptions, AgLineSeriesOptions, time } from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { useEarliestAccountEntry } from "shared/hooks/use-earliest-account-entry";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { formatCashShort } from "shared/utility/format-cash";
import { useGraphData } from "./use-graph-data";

export const WealthChart = () => {
  const wealth = useStore(store, (x) => x.wealth);
  const data = useGraphData();
  const initialFromDate = useEarliestAccountEntry().startOf("year");
  const intialToDate = getLocalDateTime().endOf("year");
  const [fromDate, setFromDate] = useState<DateTime>(getLocalDateTime().startOf("year"));
  const [toDate, setToDate] = useState<DateTime>(intialToDate);

  const filteredData = useMemo(() => {
    return data.filter((x) => {
      const year = (x["date"] as Date).getFullYear();
      return year >= fromDate.year && year <= toDate.year;
    });
  }, [data, fromDate.year, toDate.year]);

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
      data: filteredData,
      axes: [
        {
          type: "time",
          position: "bottom",
          label: {
            format: "%Y",
          },
          nice: false,
          tick: {
            interval: time.year.every(1, { snapTo: "start" }),
          },
        },
        {
          type: "number",
          position: "left",
        },
      ],
      series,
    }),
    [data, filteredData, series]
  );
  return (
    <Box position={"relative"} height="100%" width="100%">
      <AgChartsReact options={options} />
      <Box position={"absolute"} top={16} right={16} zIndex={100} width={250} display={"flex"} gap={2}>
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
