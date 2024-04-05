import { Button, Paper, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useRef } from "react";
import { AddAccountEntry } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";

export const AddEntry = (props: { accountName: string }) => {
  const { accountName } = props;
  const ref = useRef<{ date?: DateTime; value?: number }>({
    date: getLocalDateTime(),
    value: 0,
  });
  const onAddEntry = () => {
    const { date, value } = ref.current;
    if (!date || !value) {
      return;
    }
    AddAccountEntry(accountName, date, value);
  };
  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Stack spacing={1}>
        <DatePicker
          defaultValue={getLocalDateTime()}
          onChange={(date: DateTime | null) => {
            if (date) {
              ref.current.date = date;
            }
          }}
        />
        <TextField
          label="Home value"
          type="numeric"
          onChange={(event) => {
            ref.current.value = +event.target.value;
          }}
        />
        <Button onClick={onAddEntry}>Add Home Value</Button>
      </Stack>
    </Paper>
  );
};
