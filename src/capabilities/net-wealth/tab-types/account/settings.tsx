import Close from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import {
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
import { useState } from "react";
import { ConfirmDialog } from "shared/components/confirm-dialog";
import { hideAccount, removeAccount, updateAccountName } from "shared/store";

interface AccountSettingsProps {
  accountName: string;
}

export const AccountSettings = (props: AccountSettingsProps) => {
  const { accountName } = props;
  const [nextAccountName, setNextAccountName] = useState<string>(accountName);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setIsOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>
          <Stack direction={"row"} width="100%" alignItems={"center"} justify-content={"space-between"}>
            <Typography variant="h6">{accountName} Settings</Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} marginTop={1}>
            <TextField
              label="Account Name"
              value={nextAccountName}
              onChange={(event) => setNextAccountName(event.target.value)}
              placeholder=""
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <ConfirmDialog
            onConfirm={() => {
              removeAccount(accountName);
              setIsOpen(false);
            }}
            title={`Confirm Deleting ${accountName} Account`}
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
          <Button
            disabled={!nextAccountName}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!nextAccountName}
            onClick={() => {
              accountName != nextAccountName && updateAccountName(accountName, nextAccountName);
              setIsOpen(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
