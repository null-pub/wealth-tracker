import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { create } from "mutative";
import { ReactNode, forwardRef, useRef, useState } from "react";
import { store } from "shared/store";

type AssetType = "account" | "mortgage";
export const NewAccount = forwardRef<HTMLButtonElement, { children?: ReactNode }>(function NewAccount(props, ref) {
  const [open, setOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);
  const [accountType, setAccountType] = useState<AssetType>();

  return (
    <>
      <Button
        ref={ref}
        variant="outlined"
        onClick={() => {
          setOpen(true);
          setError(false);
          setAccountType(undefined);
        }}
        sx={{ marginTop: 3 }}
      >
        add account
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Account</DialogTitle>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            <TextField
              select
              color={error ? "error" : "primary"}
              onChange={(value) => {
                setError(false);
                setAccountType(value.target.value as AssetType);
              }}
              label="Type"
            >
              <MenuItem value="mortgage">Mortgage</MenuItem>
              <MenuItem value="account">Generic Account</MenuItem>
            </TextField>

            <TextField
              placeholder="Name"
              onChange={() => {
                setError(false);
              }}
              error={error}
              inputRef={nameRef}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={error}
            onClick={() => {
              store.setState((prev) => {
                return create(prev, (next) => {
                  if (!nameRef.current?.value || !accountType || prev.wealth[nameRef.current.value]) {
                    setError(true);
                    return;
                  }

                  next.wealth[nameRef.current.value] = {
                    type: accountType,
                    data: [],
                    hidden: false,
                  };

                  setOpen(false);
                });
              });
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {props?.children}
    </>
  );
});
