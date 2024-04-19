import { Button, InputAdornment, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { AddAccountEntry } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";

export const AddEntry = (props: { accountName: string }) => {
  const { accountName } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState<DateTime>();

  const onAddEntry = () => {
    const value = inputRef.current?.value;
    if (!date || !value) {
      return;
    }
    AddAccountEntry(accountName, date, +value);
  };

  return (
    <Stack spacing={2}>
      <DatePicker
        defaultValue={getLocalDateTime()}
        onChange={(date: DateTime | null) => {
          date && setDate(date);
        }}
      />
      <TextField
        key={accountName}
        label="Home value"
        type="numeric"
        inputRef={inputRef}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        placeholder="0"
      />
      <Button onClick={onAddEntry}>Add Home Value</Button>
    </Stack>
  );
};
