import { Box, Stack } from "@mui/material";
import { useState } from "react";
import { getLocalDateTime } from "shared/utility/current-date";
import { FutureEvents } from "./components/future-events";
import { WealthChart } from "./components/wealth-chart";
import { WealthTable } from "./components/wealth-table";

export const ProjectedWealth = () => {
  const localTime = getLocalDateTime();
  const [year, setYear] = useState(localTime.year);

  return (
    <Box display="flex" flexDirection="row" height="100%" width={"100%"} gap={2}>
      <Box flex="0 1 auto" height={"100%"} overflow={"auto"}>
        <FutureEvents onChange={setYear} year={year} />
      </Box>
      <Box flex="1 1 auto" overflow={"auto"}>
        <Stack spacing={2} height={"100%"} width={"100%"}>
          <WealthChart titleYear={year} />
          <WealthTable />
        </Stack>
      </Box>
    </Box>
  );
};
