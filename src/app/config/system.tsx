import DeleteForever from "@mui/icons-material/DeleteForever";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import InvalidDataDialog from "app/invalid-data-dialog";
import { useState } from "react";
import { ConfirmDialog } from "shared/components/confirm-dialog";
import { downloadJson, useExport } from "shared/hooks/use-export";
import { useImport } from "shared/hooks/use-import";
import { useStoreDataError } from "shared/hooks/use-store-data-error";
import { resetStore } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";

export const System = () => {
  const onExport = useExport();
  const onImport = useImport();
  const { hadError, parseError, resetError, invalidData } = useStoreDataError();
  const [error, setError] = useState(parseError);
  const [isOpen, setIsOpen] = useState(hadError);

  return (
    <Box marginLeft={"auto"} gap={2} display={"flex"}>
      <Button
        onClick={() =>
          onImport().catch((err) => {
            setIsOpen(true);
            setError(err);
          })
        }
      >
        Import
      </Button>
      <Button onClick={onExport}>Export</Button>
      <ConfirmDialog title="Reset Everything" onConfirm={resetStore}>
        <Button color="error">
          <DeleteForever />
          Reset
        </Button>
      </ConfirmDialog>
      <InvalidDataDialog open={isOpen} error={error}>
        {hadError && (
          <>
            <Button
              color="error"
              onClick={() => {
                setIsOpen(false);
                resetError?.();
                resetStore();
              }}
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                downloadJson(`invalid-data-wealth-tracker-${getLocalDateTime().toFormat(shortDate)}.json`, invalidData);
              }}
            >
              Download Data
            </Button>

            <Button
              onClick={() => {
                setIsOpen(false);
                resetError?.();
              }}
            >
              Ignore
            </Button>
          </>
        )}
        {!hadError && (
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
        )}
      </InvalidDataDialog>
    </Box>
  );
};
