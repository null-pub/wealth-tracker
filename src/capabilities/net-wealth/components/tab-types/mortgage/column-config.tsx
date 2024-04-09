import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import { Cash } from "shared/components/formatters/cash";
import { AccountData } from "shared/models/account-data";
import { removeAccountEntry } from "shared/store";
import { shortDate } from "shared/utility/format-date";

export const createAccountColumnConfig = (accountName: string): ColDef<AccountData>[] => [
  {
    headerName: "Date",
    sort: "desc",
    valueFormatter: (x) => x.value?.toFormat(shortDate),
    valueGetter: (x) => x.data && DateTime.fromISO(x.data.date),
  },
  {
    headerName: "Home Value",
    cellRenderer: (x: CustomCellRendererProps<AccountData>) => <Cash value={x.value} placement="left" />,
    valueGetter: (x) => x.data?.value,
    type: "numericColumn",
  },
  {
    cellStyle: () => ({ display: "inline-flex", padding: "0px" }),
    headerName: "",
    colId: "actions",
    cellRenderer: (props: CustomCellRendererProps<AccountData>) => {
      return (
        <Button
          onClick={() => {
            props.data && removeAccountEntry(accountName, props.data?.id);
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

type House = {
  date: DateTime;
  balance: number;
  equity: number;
};

export const mortgageColumnConfig: ColDef<House>[] = [
  {
    headerName: "Date",
    sort: "desc",
    valueFormatter: (x) => x.value?.toFormat(shortDate),
    valueGetter: (x) => x.data?.date,
  },
  {
    headerName: "Loan Balance",
    valueGetter: (x) => x.data?.balance.toFixed(2),
    cellRenderer: (x: CustomCellRendererProps<House>) => <Cash value={x.value} placement="left" />,
    type: "numericColumn",
  },
  {
    headerName: "Equity",
    valueGetter: (x) => x.data?.equity.toFixed(2),
    cellRenderer: (x: CustomCellRendererProps<House>) => <Cash value={x.value} placement="left" />,
    type: "numericColumn",
  },
];
