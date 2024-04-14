import { Box, Paper, Stack } from "@mui/material";
import { FutureEvents } from "./components/future-events";
import { WealthChart } from "./components/wealth-chart";
import { WealthTable } from "./components/wealth-table";

export const ProjectedWealth = () => {
  return (
    <Box display="flex" flexDirection="row" height="100%" width={"100%"} gap={2}>
      <Box flex="0 1 auto">
        <Paper sx={{ flex: "0 1 auto", padding: 2, height: "100%", overflow: "auto" }}>
          <FutureEvents />
        </Paper>
      </Box>
      <Box flex="1 1 auto" overflow={"auto"}>
        <Stack spacing={2} height={"100%"} width={"100%"}>
          <WealthChart />
          <WealthTable />
        </Stack>
      </Box>
    </Box>
  );
};
