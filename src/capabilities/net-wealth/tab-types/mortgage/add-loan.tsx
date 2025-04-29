import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { Loan } from "shared/models/store/current";
import { store } from "shared/store";
import { setLoan } from "shared/store/set-loan";
import { ZodIssue, z } from "zod";

//todo: use tanstack form

const convertPct = (value: number) => {
  return value > 1 ? value / 100 : value;
};

const validator: z.ZodType<Loan> = z.object({
  principal: z.number().min(0),
  ratePct: z.number().min(0),
  paymentsPerYear: z.number().min(0),
  payment: z.number().min(0),
  firstPaymentDate: z.string().datetime({ offset: true }),
  ownershipPct: z.number().min(0),
});

export const AddLoan = (props: { accountName: string }) => {
  const { accountName } = props;

  const loan = useStore(store, (x) => {
    const account = x.wealth[accountName];
    if ("loan" in account) {
      return account.loan;
    }
  });

  const ref = useRef<Partial<Loan>>(loan ?? {});
  const [error, setError] = useState<Partial<Record<keyof Loan, ZodIssue>>>({});

  return (
    <>
      <DatePicker
        defaultValue={ref.current?.firstPaymentDate ? DateTime.fromISO(ref.current.firstPaymentDate) : null}
        label="First Payment"
        slotProps={{
          textField: {
            error: !!error.firstPaymentDate,
          },
        }}
        onChange={(value: DateTime | null) => {
          if (value) {
            ref.current.firstPaymentDate = value.startOf("day").toISO()!;
          }
        }}
      />
      <TextField
        error={!!error.principal}
        defaultValue={loan?.principal}
        onChange={(event) => {
          ref.current.principal = +event.target.value;
        }}
        variant="outlined"
        label="Principal"
        type="number"
      />
      <TextField
        error={!!error.ratePct}
        defaultValue={loan?.ratePct}
        onChange={(event) => {
          ref.current.ratePct = convertPct(+event.target.value);
        }}
        variant="outlined"
        label="Rate"
        type="number"
      />
      <TextField
        error={!!error.paymentsPerYear}
        defaultValue={loan?.paymentsPerYear}
        onChange={(event) => {
          ref.current.paymentsPerYear = +event.target.value;
        }}
        variant="outlined"
        label="Payments Per Year"
        type="number"
      />
      <TextField
        defaultValue={loan?.payment}
        error={!!error.payment}
        onChange={(event) => {
          ref.current.payment = +event.target.value;
        }}
        variant="outlined"
        label="Payment"
        type="number"
      />
      <TextField
        defaultValue={loan?.ownershipPct}
        error={!!error.ownershipPct}
        onChange={(event) => {
          ref.current.ownershipPct = convertPct(+event.target.value);
        }}
        variant="outlined"
        label="Ownership (%)"
        type="number"
      />
      <Button
        onClick={() => {
          const parsed = validator.safeParse(ref.current);
          if (parsed.success) {
            setError({});
            setLoan(accountName, parsed.data);
          } else {
            const issues = Object.groupBy(parsed.error.issues, (x) => x.path.join(""));
            setError(issues);
          }
        }}
      >
        Set Loan
      </Button>
    </>
  );
};
