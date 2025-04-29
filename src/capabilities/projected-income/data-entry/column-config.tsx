import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UpdateIcon from "@mui/icons-material/Update";
import { Button, Tooltip } from "@mui/material";
import { Stack } from "@mui/system";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import { Cash } from "shared/components/formatters/cash";
import { Percent } from "shared/components/formatters/percent";
import { AccountData, TimeSeries } from "shared/models/store/current";
import { updateProjectedIncome } from "shared/store";
import { removeProjectedIncome } from "shared/store/remove-projected-income";
import { updateProjectedIncomeDate } from "shared/store/update-projected-income-date";
import { shortDate } from "shared/utility/format-date";

export const createAccountColumnConfig = (
  accountName: TimeSeries,
  variant: "number" | "cash" | "percent",
  dateVariant: "date" | "year"
): ColDef<AccountData>[] => [
  {
    headerName: dateVariant === "date" ? "Date" : "Year",
    colId: "date",
    sort: "desc",
    valueFormatter: (x) => x.value?.toFormat(dateVariant === "date" ? shortDate : "yyyy"),
    valueGetter: (x) => x.data && DateTime.fromISO(x.data.date),
    tooltipValueGetter: (x) => (dateVariant === "year" ? x.value?.toFormat(shortDate) : undefined),
    cellRenderer: (x: ICellRendererParams<unknown, DateTime>) => {
      return (
        <Stack direction={"row"} alignItems={"center"}>
          {x.valueFormatted}&nbsp;
          {x.value && x.value > DateTime.local() && (
            <Tooltip title="Future Event">
              <UpdateIcon htmlColor="orange" />
            </Tooltip>
          )}
        </Stack>
      );
    },
    cellEditor: dateVariant === "date" ? "agDateCellEditor" : "agNumberCellEditor",
    editable: true,
    valueSetter: (x) => {
      const date = dateVariant === "date" ? DateTime.fromJSDate(x.newValue) : DateTime.fromISO(x.data.date).set({ year: x.newValue });

      if (date.isValid) {
        updateProjectedIncomeDate(accountName, x.data, date);
      }
      return date.isValid;
    },
  },
  {
    headerName: "Value",
    valueGetter: (x) => x.data?.value,
    cellRenderer: (x: CustomCellRendererProps<AccountData>) =>
      variant === "cash" ? <Cash compact={false} value={x.value} /> : <Percent value={x.value} />,
    type: "numericColumn",
    editable: true,
    cellEditor: "agNumberCellEditor",
    valueSetter: (x) => {
      updateProjectedIncome(accountName, x.data, +x.newValue);
      return true;
    },
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
            props.data && removeProjectedIncome(accountName, props.data);
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
