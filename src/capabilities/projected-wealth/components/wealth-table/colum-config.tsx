import QueryStatsIcon from "@mui/icons-material/QueryStats";
import UpdateIcon from "@mui/icons-material/Update";
import { Tooltip } from "@mui/material";
import { Stack } from "@mui/system";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { DateTime } from "luxon";
import { Cash } from "shared/components/formatters/cash";
import { Percent } from "shared/components/formatters/percent";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";
import { TimeSeriesWealth } from "../../hooks/use-times-series-wealth";

export const columnConfig: ColDef<TimeSeriesWealth>[] = [
  {
    headerName: "Date",
    sort: "desc",
    valueFormatter: (x) => x.value?.toFormat(shortDate),
    valueGetter: (x) => x.data?.date,
    cellRenderer: (x: ICellRendererParams<unknown, DateTime>) => {
      const systemYear = getLocalDateTime().year;
      return (
        <Stack direction={"row"} alignItems={"center"}>
          {x.valueFormatted}&nbsp;
          {x.value && x.value > getLocalDateTime() && (
            <Tooltip title="Future Event">
              <UpdateIcon htmlColor="yellow" />
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
              <Tooltip title="Benchmark for current and future entries">
                <QueryStatsIcon htmlColor="yellow" />
              </Tooltip>
            )}
        </Stack>
      );
    },
  },
  {
    type: "numericColumn",
    headerName: "Wealth",
    valueGetter: (x) => x.data?.wealth,
    cellRenderer: (x: ICellRendererParams<unknown, number>) => {
      return x.value && <Cash value={x.value} placement="left" />;
    },
  },
  {
    type: "numericColumn",
    headerName: "YoY ($)",
    valueGetter: (x) => x.data?.yoyCash,
    cellRenderer: (x: ICellRendererParams<unknown, number>) => {
      return x.value && <Cash value={x.value} placement="left" />;
    },
  },
  {
    type: "numericColumn",
    headerName: "YoY (%)",
    valueGetter: (x) => x.data?.yoyPct,
    cellRenderer: (x: ICellRendererParams<unknown, number>) => {
      return x.value && <Percent value={x.value} />;
    },
  },
];
