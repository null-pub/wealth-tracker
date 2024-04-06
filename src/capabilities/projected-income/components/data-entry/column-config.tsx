import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UpdateIcon from "@mui/icons-material/Update";
import { Button, Tooltip } from "@mui/material";
import { Stack } from "@mui/system";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import { AccountData } from "shared/models/account-data";
import { TimeSeries } from "shared/models/projected-income";
import { updateProjectedIncome } from "shared/store";
import { removeProjectedIncome } from "shared/store/remove-projected-income";
import { updateProjectedIncomeDate } from "shared/store/update-projected-income-date";
import { formatCash } from "shared/utility/format-cash";
import { shortDate } from "shared/utility/format-date";

export const createAccountColumnConfig = (
  accountName: TimeSeries,
  variant: "number" | "cash" | "percent"
): ColDef<AccountData>[] => [
  {
    headerName: "Date",
    sort: "desc",
    valueFormatter: (x) => x.value?.toFormat(shortDate),
    valueGetter: (x) => x.data && DateTime.fromISO(x.data.date),
    cellRenderer: (x: ICellRendererParams<unknown, DateTime>) => {
      return (
        <Stack direction={"row"} alignItems={"center"}>
          {x.valueFormatted}&nbsp;
          {x.value && x.value > DateTime.local() && (
            <Tooltip title="Future Event">
              <UpdateIcon htmlColor="yellow" />
            </Tooltip>
          )}
        </Stack>
      );
    },
    cellEditor: "agDateCellEditor",
    editable: true,
    valueSetter: (x) => {
      const date = DateTime.fromJSDate(x.newValue);
      if (date.isValid) {
        updateProjectedIncomeDate(accountName, x.data.id, DateTime.fromJSDate(x.newValue));
      }
      return date.isValid;
    },
  },
  {
    headerName: "Value",
    valueGetter: (x) => x.data?.value,
    valueFormatter: (x) =>
      variant === "number" ? x.value : variant === "cash" ? formatCash(x.value) : (x.value * 100).toFixed(2) + "%",
    type: "numericColumn",
    editable: true,
    cellEditor: "agNumberCellEditor",
    valueSetter: (x) => {
      updateProjectedIncome(accountName, x.data.id, +x.newValue);
      return true;
    },
  },
  {
    headerName: "Actions",
    cellRenderer: (props: CustomCellRendererProps<AccountData>) => {
      return (
        <Button
          onClick={() => {
            props.data && removeProjectedIncome(accountName, props.data?.id);
          }}
          color="error"
        >
          <DeleteForeverIcon />
        </Button>
      );
    },
  },
];
