import { Button, InputAdornment, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { addAccountEntry, store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";

export const AddEntry = (props: { accountName: string }) => {
  const { accountName } = props;
  const [date, setDate] = useState<DateTime>(getLocalDateTime());
  const [amount, setAmount] = useState<number | null>(null);

  const onAddEntry = () => {
    if (date != undefined && amount != null) {
      addAccountEntry(accountName, date, amount);
      setAmount(null);
    }
  };

  const account = useStore(store, (state) => state.wealth[accountName]);
  const hasSameDate = useMemo(() => {
    return !!account?.data?.find((x) => date?.hasSame(DateTime.fromISO(x.date), "day"));
  }, [account?.data, date]);

  return (
    <Stack spacing={2}>
      <DatePicker
        value={date}
        onChange={(date: DateTime | null) => {
          date && setDate(date);
        }}
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
        Add Home Value
      </Button>
    </Stack>
  );
};
