import InsertChartIcon from "@mui/icons-material/InsertChart";
import { Tooltip } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { AgCartesianChartOptions, AgColorType } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { DateTime } from "luxon";
import { TimeSeriesKeys } from "shared/models/store/current";
import { store } from "shared/store";
import { ckmeans, collapseClusters } from "shared/utility/ckmeans";
import { formatCash } from "shared/utility/format-cash";
import { formatPercent } from "shared/utility/format-percent";
import { getProbablityColor } from "shared/utility/get-probablity-color";
import { sortByDate } from "shared/utility/sort-by-date";

export const SparkChart = (props: { accountName: TimeSeriesKeys; variant: "cash" | "percent" | "number" }) => {
  const { accountName, variant } = props;
  const account = useStore(store, (x) => x.projectedIncome.timeSeries[accountName]);
  const data = account.map((x) => ({ ...x, date: DateTime.fromISO(x.date).toJSDate() }));
  const selector = (x: { date: Date; value: number }) => x.value;
  const maxClusters = Math.min(data.length, 3);

  const ckData = collapseClusters(ckmeans(data, maxClusters, selector), selector)
    .map((x) => {
      return x.map((y, i, subArr) => ({
        ...y,
        cluster: subArr.length / data.length,
        color: getProbablityColor(subArr.length / data.length) as AgColorType,
      }));
    })
    .flat()
    .sort(sortByDate((x) => DateTime.fromJSDate(x.date), "asc"));

  const options: AgCartesianChartOptions = {
    data: ckData,
    theme: "ag-default-dark",
    series: [
      {
        type: "line",
        yKey: "value",
        xKey: "date",
        stroke: "white",
        marker: {
          itemStyler: (params) => {
            const fill = variant === "percent" ? "#FFF" : params.datum.color;
            return {
              fill,
              size: 10,
            };
          },
        },
      },
    ],
    axes: [
      {
        type: "number",
        position: "left",

        nice: true,
        interval: {
          maxSpacing: 45,
        },
        label: {
          formatter: (params) => {
            return variant === "percent" ? formatPercent(params.value) : formatCash(params.value);
          },
        },
      },
      {
        nice: false,
        type: "time",
        position: "bottom",
        label: {
          format: "%Y",
        },
      },
    ],
  };

  const isDisabled = account.length === 0;

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
      title={<AgCharts options={options} css={{ width: 750, height: 375 }} />}
    >
      <InsertChartIcon color={isDisabled ? "disabled" : undefined} />
    </Tooltip>
  );
};
