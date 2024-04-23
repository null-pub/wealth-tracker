import QueryStatsIcon from "@mui/icons-material/QueryStats";
import TodayIcon from "@mui/icons-material/Today";
import UpdateIcon from "@mui/icons-material/Update";
import { Tooltip } from "@mui/material";
import { Stack } from "@mui/system";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { DateTime } from "luxon";
import { Cash } from "shared/components/formatters/cash";
import { Percent } from "shared/components/formatters/percent";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";
import { TimeSeriesWealth } from "../hooks/use-times-series-wealth";

export const columnConfig: ColDef<TimeSeriesWealth>[] = [
  {
    headerName: "Date",
    colId: "date",
    sort: "desc",
    valueFormatter: (x) => x.value?.toFormat(shortDate),
    valueGetter: (x) => x.data?.date,
    cellRenderer: (x: ICellRendererParams<unknown, DateTime>) => {
      const localDateTime = getLocalDateTime().startOf("day");
      const systemYear = localDateTime.year;
      return (
        <Stack direction={"row"} alignItems={"center"}>
          {x.valueFormatted}&nbsp;
          {x.value && x.value.equals(localDateTime) && (
            <Tooltip title="Today">
              <TodayIcon htmlColor="yellow" />
            </Tooltip>
          )}
          {x.value &&
            x.value.equals(
              DateTime.fromObject({
                day: 1,
                month: 1,
                year: systemYear,
              })
            ) && (
              <Tooltip
                title={`Benchmark for ${localDateTime.toFormat(shortDate)} & ${localDateTime.set({ day: 1, month: 1 }).plus({ years: 1 }).toFormat(shortDate)} `}
              >
                <QueryStatsIcon htmlColor="yellow" />
              </Tooltip>
            )}
          {x.value &&
            x.value.equals(
              DateTime.fromObject({
                day: 1,
                month: 1,
                year: systemYear + 1,
              })
            ) && (
              <Tooltip
                title={`Benchmark for ${localDateTime.set({ day: 1, month: 1 }).plus({ years: 2 }).toFormat(shortDate)} `}
              >
                <QueryStatsIcon htmlColor="red" />
              </Tooltip>
            )}
          {x.value && x.value > localDateTime && (
            <Tooltip title="Future Event">
              <UpdateIcon htmlColor={x.value.year - systemYear > 1 ? "red" : "yellow"} />
            </Tooltip>
          )}
        </Stack>
      );
    },
  },
  {
    type: "numericColumn",
    headerName: "Wealth",
    colId: "wealth",
    valueGetter: (x) => x.data?.wealth,
    cellRenderer: (x: ICellRendererParams<unknown, number>) => {
      return x.value && <Cash value={x.value} placement="left" />;
    },
  },
  {
    colId: "yoy-cash",
    type: "numericColumn",
    headerName: "YoY ($)",
    valueGetter: (x) => x.data?.yoyCash,
    cellRenderer: (x: ICellRendererParams<unknown, number>) => {
      return x.value && <Cash value={x.value} placement="left" />;
    },
  },
  {
    colId: "yoy-percent",
    type: "numericColumn",
    headerName: "YoY (%)",
    valueGetter: (x) => x.data?.yoyPct,
    cellRenderer: (x: ICellRendererParams<unknown, number>) => {
      return x.value && <Percent value={x.value} />;
    },
    minWidth: 60,
  },
];
