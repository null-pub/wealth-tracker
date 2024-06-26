import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import { Cash } from "shared/components/formatters/cash";
import { AccountData } from "shared/models/store/current";
import { updateAccountDate, updateAccountValue } from "shared/store";
import { removeAccountEntry } from "shared/store/remove-account-entry";
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
      const date = DateTime.fromJSDate(x.newValue);
      if (date.isValid) {
        updateAccountDate(accountName, x.data, date);
      }
      return date.isValid;
    },
  },
  {
    headerName: "Value",
    valueGetter: (x) => x.data?.value,
    valueSetter: (x) => {
      updateAccountValue(accountName, x.data, +x.newValue);
      return true;
    },
    cellRenderer: (x: CustomCellRendererProps<AccountData>) => <Cash value={x.value} placement="left" />,
    editable: true,
    cellEditor: "agNumberCellEditor",
    type: "numericColumn",
  },
  {
    cellStyle: () => ({ display: "inline-flex", padding: "0px" }),
    sortable: false,
    headerName: "",
    width: 80,
    colId: "actions",
    cellRenderer: (props: CustomCellRendererProps<AccountData>) => {
      return (
        <Button
          onClick={() => {
            props.data && removeAccountEntry(accountName, props.data);
          }}
          color="error"
          fullWidth
        >
          <DeleteForeverIcon />
        </Button>
      );
    },
  },
];
