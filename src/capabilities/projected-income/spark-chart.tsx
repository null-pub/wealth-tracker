import InsertChartIcon from "@mui/icons-material/InsertChart";
import { Tooltip } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { AgCartesianChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { TimeSeries } from "shared/models/store/current";
import { store } from "shared/store";
import { ckmeans, collapseClusters } from "shared/utility/ckmeans";
import { formatCash } from "shared/utility/format-cash";
import { formatPercent } from "shared/utility/format-percent";
import { sortByDate } from "shared/utility/sort-by-date";

interface DataPoint {
  date: Date;
  value: number;
  id: string;
  cluster: number;
  color: string;
}

interface ChartElement {
  datum: DataPoint;
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
}

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

export const SparkChart = (props: { accountName: TimeSeries; variant: "cash" | "percent" | "number" }) => {
  const { accountName, variant } = props;
  const account = useStore(store, (x) => x.projectedIncome.timeSeries[accountName]);

  const ckData = useMemo(() => {
    const data = account.map((x) => ({ ...x, date: DateTime.fromISO(x.date).toJSDate() }));
    const selector = (x: { date: Date; value: number }) => x.value;
    const maxClusters = Math.min(data.length, 3);
    const ck = collapseClusters(ckmeans(data, maxClusters, selector), selector)
      .map((x) => {
        return x.map((y, i, subArr) => ({
          ...y,
          cluster: subArr.length / data.length,
          color: getColor(subArr.length / data.length),
        }));
      })
      .flat()
      .sort(sortByDate((x) => DateTime.fromJSDate(x.date), "asc"));
    return ck;
  }, [account]);

  const options = useMemo((): AgCartesianChartOptions => {
    return {
      data: ckData,
      theme: "ag-default-dark",
      series: [
        {
          type: "line",
          yKey: "value",
          xKey: "date",
          stroke: "white",
          marker:
            variant === "percent"
              ? {
                  itemStyler: (params: ChartElement) => {
                    return {
                      fill: params.datum.color,
                      size: 10,
                    };
                  },
                }
              : { fill: "white", size: 10 },
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
  }, [ckData, variant]);

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
      title={<AgCharts options={options} css={{ width: 600, height: 300 }} />}
    >
      <InsertChartIcon color={isDisabled ? "disabled" : undefined} />
    </Tooltip>
  );
};
