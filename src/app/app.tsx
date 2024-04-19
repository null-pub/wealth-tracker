import { Box, Stack, Tab, Tabs } from "@mui/material";
import { NetWealth } from "capabilities/net-wealth";
import { ProjectedIncome } from "capabilities/projected-income";
import { ProjectedWealth } from "capabilities/projected-wealth";
import { useState } from "react";
import { ConfigModal } from "./config/config-modal";

export const App = () => {
  const [tab, setTab] = useState<string>("wealth");

  return (
    <Box padding={2} paddingTop={0} display={"flex"} flexDirection={"column"} height="100%" gap={2}>
      <Box flex="0 1 auto">
        <Stack direction="row">
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value="wealth" label="Total Wealth" />
            <Tab value="projected-income" label="Projected Income" />
            <Tab value="projected-wealth" label="Projected Wealth" />
          </Tabs>
          <Box marginLeft={"auto"} gap={2} display={"flex"}>
            <ConfigModal />
          </Box>
        </Stack>
      </Box>
      <Box flex="1 1 auto" height={"100%"} width={"100%"} overflow="hidden">
        {tab === "wealth" && <NetWealth />}
        {tab === "projected-income" && <ProjectedIncome />}
        {tab === "projected-wealth" && <ProjectedWealth />}
      </Box>
    </Box>
  );
};
