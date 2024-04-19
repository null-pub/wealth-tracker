import { Alert, Box, Button, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo, useRef, useState } from "react";
import { AgGrid } from "shared/components/ag-grid";
import { Account } from "shared/models/store/current";
import { AddAccountEntry, store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";
import { createAccountColumnConfig } from "./column-config";
import { useMissingYears } from "./hooks/useMissingYears";
import { AccountSettings } from "./settings";

export const AccountTab = (props: { accountName: string }) => {
  const { accountName } = props;
  const account = useStore(store, (state) => state.wealth[accountName]) as Account;
  const [date, setDate] = useState(getLocalDateTime());
  const inputRef = useRef<HTMLInputElement>(null);

  const missingYears = useMissingYears(account);
  const hasSameDate = useMemo(() => {
    return !!account?.data?.find((x) => date.hasSame(DateTime.fromISO(x.date), "day"));
  }, [account?.data, date]);

  const onAddEntry = () => {
    inputRef.current && AddAccountEntry(accountName, date, +inputRef.current?.value);
  };

  const accountColumnConfig = useMemo(() => {
    return createAccountColumnConfig(accountName);
  }, [accountName]);

  return (
    <Stack height="100%" spacing={2}>
      <Stack direction={"row"}>
        <Typography variant="h5">{accountName}</Typography>
        <Box sx={{ marginLeft: "auto" }}>
          <AccountSettings key={accountName} accountName={accountName} />
        </Box>
      </Stack>
      {missingYears.length > 0 && (
        <Grid xs={12}>
          <Paper elevation={3}>
            <Alert severity="warning">Ensure an entry for Jan 1st for each year {missingYears.join(", ")}</Alert>
          </Paper>
        </Grid>
      )}

      <DatePicker
        format={shortDate}
        sx={{ color: "white" }}
        label="Date"
        defaultValue={date}
        onChange={(value) => value && setDate(value)}
      />
      <TextField
        key={accountName}
        label="amount"
        type="number"
        inputRef={inputRef}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        placeholder="0"
      />
      <Button disabled={!date || hasSameDate} onClick={onAddEntry}>
        Add Entry
      </Button>

      <AgGrid
        reactiveCustomComponents
        rowData={account.data}
        columnDefs={accountColumnConfig}
        id={account + "-history"}
        autoSizeStrategy={{ type: "fitGridWidth" }}
        onRowDataUpdated={(x) => x.api.sizeColumnsToFit()}
        stopEditingWhenCellsLoseFocus
      />
    </Stack>
  );
};
