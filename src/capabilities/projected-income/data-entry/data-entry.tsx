import { Box, Button, InputAdornment, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useState } from "react";
import { AgGrid } from "shared/components/ag-grid";
import { MAX_NUM_ENTRIES } from "shared/constants";
import { TimeSeriesKeys } from "shared/models/store/current";
import { addProjectedIncome, store } from "shared/store";
import { shortDate } from "shared/utility/format-date";
import { SparkChart } from "../spark-chart";
import { createAccountColumnConfig } from "./column-config";

const disabledStyle = {
  color: "grey",
};

const DataEntry = (props: {
  timeSeries: TimeSeriesKeys;
  defaultDate: DateTime;
  variant?: "number" | "cash" | "percent";
  dateVariant?: "date" | "year";
}) => {
  const { timeSeries, defaultDate, variant = "number", dateVariant = "date" } = props;
  const account = useStore(store, (state) => state.projectedIncome.timeSeries[timeSeries]);

  const [date, setDate] = useState(defaultDate);
  const [amount, setAmount] = useState<number | null>(null);

  const hasSameDate = !!account?.find((x) => date.hasSame(DateTime.fromISO(x.date), "day"));

  const onAddEntry = () => {
    if (amount != null) {
      addProjectedIncome(date, timeSeries, variant === "percent" ? amount / 100 : amount);
      setAmount(null);
    }
  };

  const accountColumnConfig = createAccountColumnConfig(timeSeries, variant, dateVariant);

  return (
    <Box display={"flex"} flexDirection={"column"} height="100%">
      <Stack spacing={2} flex="0 1 auto">
        <DatePicker
          format={dateVariant === "year" ? "yyyy" : shortDate}
          views={dateVariant === "year" ? ["year"] : undefined}
          sx={{ color: "white" }}
          label={dateVariant === "date" ? "Date" : "Year"}
          value={date}
          onChange={(value) => {
            console.log(value);
            value && setDate(value);
          }}
        />
        <TextField
          label="Amount"
          value={amount ?? ""}
          placeholder="0"
          type="number"
          onChange={(event) => (event.target.value === "" ? setAmount(null) : setAmount(+event.target.value))}
          slotProps={{
            input: {
              startAdornment: variant !== "number" && <InputAdornment position="start">{variant === "cash" ? "$" : "%"}</InputAdornment>,
            },
          }}
        />
        <Button disabled={amount === null || !date || hasSameDate} onClick={onAddEntry}>
          Add Entry
        </Button>
      </Stack>
      <Box sx={{ paddingTop: 2, flex: "1 1 auto" }}>
        <AgGrid
          rowData={account ?? []}
          columnDefs={accountColumnConfig}
          id={account + "-history"}
          autoSizeStrategy={{
            type: "fitGridWidth",
          }}
          stopEditingWhenCellsLoseFocus
          getRowStyle={(x) => {
            return x.rowIndex >= MAX_NUM_ENTRIES ? disabledStyle : undefined;
          }}
        />
      </Box>
    </Box>
  );
};

interface LayoutProps {
  title: string;
  accountName: TimeSeriesKeys;
  defaultDate: DateTime;
  variant: "percent" | "number" | "cash";
  dateVariant?: "date" | "year";
}

export const DataEntryLayout = (props: LayoutProps) => {
  const { title, accountName, defaultDate, variant, dateVariant = "date" } = props;
  return (
    <Paper sx={{ padding: 2, height: "100%", width: 450, flexShrink: 0 }}>
      <Box display="flex" flexDirection="column" height="100%">
        <Box flex="0 1 auto" marginBottom={4} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
          <Typography variant="h5">
            {title}{" "}
            {variant === "cash" && (
              <Tooltip
                title={
                  <>
                    <span>Cash values are used in lieu of Percent values.</span>
                    <br />
                    <span>Cash values are considered actual payment values.</span>
                  </>
                }
              >
                <span>($)</span>
              </Tooltip>
            )}
            {variant === "percent" && (
              <Tooltip title="Percentage values are used for predictions.">
                <span>(%)</span>
              </Tooltip>
            )}
          </Typography>
          <SparkChart accountName={accountName} variant={variant} />
        </Box>
        <Box flex="1 1 auto">
          <DataEntry variant={variant} timeSeries={accountName} defaultDate={defaultDate} dateVariant={dateVariant} />
        </Box>
      </Box>
    </Paper>
  );
};
