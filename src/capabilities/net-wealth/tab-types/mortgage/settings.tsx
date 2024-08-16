import Close from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { ConfirmDialog } from "shared/components/confirm-dialog";
import { Loan } from "shared/models/store/version-1";
import { hideAccount, removeAccount, setLoan, store, updateAccountName } from "shared/store";
import { ZodIssue, z } from "zod";

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

interface AccountSettingsProps {
  accountName: string;
}

export const AccountSettings = (props: AccountSettingsProps) => {
  const { accountName } = props;
  const [nextAccountName, setNextAccountName] = useState<string>(accountName);
  const loan = useStore(store, (x) => {
    const account = x.wealth[accountName];
    if ("loan" in account) {
      return account.loan;
    }
  });

  const ref = useRef<Partial<Loan>>(loan ?? {});
  const [error, setError] = useState<Partial<Record<keyof Loan, ZodIssue>>>({});

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setError({});
    ref.current = loan ?? {};
    setIsOpen(false);
  };

  return (
    <>
      <IconButton onClick={() => setIsOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle sx={{ width: "100%" }}>
          <Box display={"flex"} width="100%" alignItems={"center"} sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6">{accountName} Settings</Typography>
            <IconButton sx={{ marginLeft: "auto" }} onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} marginTop={1}>
            <TextField
              label="Account Name"
              value={nextAccountName}
              onChange={(event) => setNextAccountName(event.target.value)}
              placeholder=""
            />
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <ConfirmDialog
            onConfirm={() => {
              removeAccount(accountName);
              setIsOpen(false);
            }}
            title={`Confirm Deleting ${accountName} Mortgage`}
          >
            <Button color="error">Delete Account</Button>
          </ConfirmDialog>
          <ConfirmDialog
            onConfirm={() => {
              hideAccount(accountName);
              setIsOpen(false);
            }}
            title={`Confirm Hiding ${accountName} Account`}
          >
            <Button sx={{ marginRight: 10 }} color="error">
              Hide Account
            </Button>
          </ConfirmDialog>
          <Button disabled={!nextAccountName} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={!nextAccountName}
            onClick={() => {
              const parsed = validator.safeParse(ref.current);
              if (parsed.success) {
                accountName != nextAccountName && updateAccountName(accountName, nextAccountName);
                setLoan(accountName, parsed.data);
                handleClose();
              } else {
                const issues = Object.groupBy(parsed.error.issues, (x) => x.path.join(""));
                setError(issues);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
