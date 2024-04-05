import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import { AccountData } from "shared/models/account-data";
import { updateAccountDate, updateAccountValue } from "shared/store";
import { removeAccountEntry } from "shared/store/remove-account-entry";
import { formatCashShort } from "shared/utility/format-cash";
import { shortDate } from "shared/utility/format-date";

export const createAccountColumnConfig = (accountName: string): ColDef<AccountData>[] => [
  {
    headerName: "Date",
    sort: "desc",
    valueFormatter: (x) => x.value?.toFormat(shortDate),
    valueGetter: (x) => x.data && DateTime.fromISO(x.data.date),
    cellEditor: "agDateCellEditor",
    editable: true,
    valueSetter: (x) => {
      updateAccountDate(accountName, x.data.id, DateTime.fromJSDate(x.newValue));
      return true;
    },
  },
  {
    headerName: "Value",
    valueGetter: (x) => x.data?.value,
    valueFormatter: (x) => formatCashShort(x.value),
    valueSetter: (x) => {
      updateAccountValue(accountName, x.data.id, +x.newValue);
      return true;
    },
    editable: true,
    cellEditor: "agNumberCellEditor",
    type: "numericColumn",
  },
  {
    headerName: "Actions",
    cellRenderer: (props: CustomCellRendererProps<AccountData>) => {
      return (
        <Button
          onClick={() => {
            props.data && removeAccountEntry(accountName, props.data.id);
          }}
          color="error"
        >
          <DeleteForeverIcon />
        </Button>
      );
    },
  },
];
