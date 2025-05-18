import { Box } from "@mui/material";
import { PerformanceConfig } from "./performance-config";
import { ScenarioExplorer } from "./scenario-explorer";

export const ProjectedIncome = () => {
  return (
    <Box display="flex" flexDirection="column" height="100%" width={"100%"} gap={2}>
      <ScenarioExplorer />

      <PerformanceConfig />
    </Box>
  );
};
