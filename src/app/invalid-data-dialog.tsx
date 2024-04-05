import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ReactNode } from "react";
import { ZodError } from "zod";

interface InvalidDataDialogProps {
  open?: boolean;
  error?: ZodError;
  children?: ReactNode;
}

export default function InvalidDataDialog(props: InvalidDataDialogProps) {
  const { open, error, children } = props;

  return (
    <>
      <Dialog open={!!open}>
        <DialogTitle id="alert-dialog-title">{"Error Loading Data"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box maxHeight={500} overflow={"auto"}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Error Message</TableCell>
                    <TableCell>Path</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {error?.issues.map((x, idx) => {
                    return (
                      <TableRow key={idx}>
                        <TableCell>{x.message}</TableCell>
                        <TableCell>{x.path.join(".")}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>{children}</DialogActions>
      </Dialog>
    </>
  );
}
