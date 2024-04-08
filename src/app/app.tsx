import DeleteForever from "@mui/icons-material/DeleteForever";
import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import { NetWealth } from "capabilities/net-wealth";
import { ProjectedIncome } from "capabilities/projected-income";
import { ProjectedWealth } from "capabilities/projected-wealth";
import { useState } from "react";
import { SafetyButton } from "shared/components/safety-button";
import { downloadJson, useExport } from "shared/hooks/use-export";
import { useImport } from "shared/hooks/use-import";
import { useStoreDataError } from "shared/hooks/use-store-data-error";
import { resetStore } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";
import InvalidDataDialog from "./invalid-data-dialog";

export const App = () => {
  const [tab, setTab] = useState<string>("wealth");
  const onExport = useExport();
  const onImport = useImport();
  const { hadError, parseError, resetError, invalidData } = useStoreDataError();
  const [error, setError] = useState(parseError);
  const [isOpen, setIsOpen] = useState(hadError);

  return (
    <>
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
      <Stack direction="row">
        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
          <Tab value="wealth" label="Total Wealth" />
          <Tab value="projected-income" label="Projected Income" />
          <Tab value="projected-wealth" label="Projected Wealth" />
        </Tabs>
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
          <SafetyButton
            onConfirm={resetStore}
            inactiveLabel="Reset"
            activatingLabel="Activating"
            activeLabel="Confirm"
            confirmedLabel="confirmed"
            color="error"
            icon={<DeleteForever />}
          />
        </Box>
      </Stack>
      <Box padding={2} height={"95%"} width={"100%"}>
        {tab === "wealth" && <NetWealth />}
        {tab === "projected-income" && <ProjectedIncome />}
        {tab === "projected-wealth" && <ProjectedWealth />}
      </Box>
    </>
  );
};
