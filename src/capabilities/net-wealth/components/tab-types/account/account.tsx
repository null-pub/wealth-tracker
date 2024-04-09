import { Alert, Button, InputAdornment, Paper, Stack, TextField } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo, useRef, useState } from "react";
import { AgGrid } from "shared/components/ag-grid";
import { Account } from "shared/models/account";
import { AddAccountEntry, store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";
import { DeleteAccount } from "../components/delete-account";
import { RenameAccount } from "../components/update-account";
import { createAccountColumnConfig } from "./column-config";
import { useMissingYears } from "./hooks/useMissingYears";

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
    <Grid container height="100%" width={"100%"} padding={1} spacing={2}>
      <Grid lg={3} xl={3}>
        <AgGrid
          key={accountName}
          reactiveCustomComponents
          rowData={account?.data ?? []}
          columnDefs={accountColumnConfig}
          id={account + "-history"}
          autoSizeStrategy={{ type: "fitGridWidth" }}
          stopEditingWhenCellsLoseFocus
        />
      </Grid>
      <Grid xl={9} lg={8}>
        <div>
          <Grid container spacing={2}>
            {missingYears.length > 0 && (
              <Grid xs={12}>
                <Paper elevation={3}>
                  <Alert severity="warning">Ensure an entry for Jan 1st for each year {missingYears.join(", ")}</Alert>
                </Paper>
              </Grid>
            )}
            <Grid xl={2} lg={3}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Stack spacing={1}>
                  <DatePicker
                    format={shortDate}
                    sx={{ color: "white" }}
                    label="Date"
                    defaultValue={date}
                    onChange={(value) => value && setDate(value)}
                  />
                  <TextField
                    label="amount"
                    type="number"
                    defaultValue={0}
                    inputRef={inputRef}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    placeholder="0"
                  />
                  <Button disabled={!date || hasSameDate} onClick={onAddEntry}>
                    Add Entry
                  </Button>
                </Stack>
              </Paper>
            </Grid>
            <Grid xl={8} lg={0}></Grid>
            <Grid xl={2} lg={4}>
              <Stack spacing={2}>
                <DeleteAccount accountName={accountName} />
                <RenameAccount key={accountName} accountName={accountName} />
              </Stack>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};
