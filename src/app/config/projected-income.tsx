import { Box } from "@mui/material";
import { PerformanceConfig } from "./performance-config";
import { ScenarioExplorer } from "./scenario-explorer";

export const ProjectedIncome = () => {
  return (
    <Box display="flex" flexDirection="row" height="100%" width={"100%"}>
      <Box flex="0 1 auto" maxWidth={500} height="100%">
        <ScenarioExplorer />
      </Box>

      <Box flex="1 1 auto" overflow={"auto"} paddingBottom={2} paddingLeft={1}>
        <Box display={"flex"} height={"100%"} width={"100%"} gap={2}>
          <PerformanceConfig />
        </Box>
      </Box>
    </Box>
  );
};
