import { Button, Paper } from "@mui/material";
import { removeAccount } from "shared/store";

export const DeleteAccount = (props: { accountName: string }) => {
  const { accountName } = props;

  return (
    <Paper elevation={3} sx={{ padding: 2, width: "100%" }}>
      <Button
        onClick={() => {
          removeAccount(accountName);
        }}
        color="error"
      >
        Delete Account
      </Button>
    </Paper>
  );
};
