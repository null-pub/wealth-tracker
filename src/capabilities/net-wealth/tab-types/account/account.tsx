import { Alert, Box, Button, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { AgGrid } from "shared/components/ag-grid";
import { Account } from "shared/models/store/current";
import { addAccountEntry, store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";
import { createAccountColumnConfig } from "./column-config";
import { useMissingYears } from "./hooks/useMissingYears";
import { AccountSettings } from "./settings";

export const AccountTab = (props: { accountName: string }) => {
  const { accountName } = props;
  const account = useStore(store, (state) => state.wealth[accountName]) as Account;
  const [date, setDate] = useState(getLocalDateTime());
  const [amount, setAmount] = useState<number | null>(null);

  const missingYears = useMissingYears(account);
  const hasSameDate = useMemo(() => {
    return !!account?.data?.find((x) => date.hasSame(DateTime.fromISO(x.date), "day"));
  }, [account?.data, date]);

  const onAddEntry = () => {
    if (amount != null) {
      addAccountEntry(accountName, date, amount);
      setAmount(null);
    }
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
            <Alert severity="warning">Ensure an entry for Jan 1st for {missingYears.join(", ")}</Alert>
          </Paper>
        </Grid>
      )}

      <DatePicker
        format={shortDate}
        sx={{ color: "white" }}
        label="Date"
        defaultValue={date}
        onChange={(value) => value && setDate(value)}
        disableFuture
      />
      <TextField
        label="amount"
        value={amount ?? ""}
        type="number"
        onChange={(event) => (event.target.value === "" ? setAmount(null) : setAmount(+event.target.value))}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        placeholder="0"
      />
      <Button disabled={amount === null || !date || hasSameDate} onClick={onAddEntry}>
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
