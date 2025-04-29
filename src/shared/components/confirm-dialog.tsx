import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { ReactElement, useState } from "react";

interface ConfirmDialogProps {
  onConfirm?: () => void;
  title: string;
  children: ReactElement;
}
export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { onConfirm, title, children } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle sx={{ minWidth: 300, display: "flex", justifyContent: "center" }}>{title}</DialogTitle>
        <DialogActions>
          <Button sx={{ marginRight: "auto" }} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onConfirm?.();
              setIsOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
