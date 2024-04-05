import { Button, Paper, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { updateAccountName } from "shared/store/update-account-name";

export const RenameAccount = (props: { accountName: string }) => {
  const { accountName } = props;
  const [nextAccountName, setNextAccountName] = useState<string>(accountName);

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Stack spacing={1}>
        <TextField
          label="Account Name"
          value={nextAccountName}
          onChange={(event) => setNextAccountName(event.target.value)}
          placeholder=""
        />
        <Button
          disabled={!nextAccountName}
          onClick={() => {
            updateAccountName(accountName, nextAccountName);
          }}
        >
          Update Name
        </Button>
      </Stack>
    </Paper>
  );
};
