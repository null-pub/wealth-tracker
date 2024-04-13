import { Grid, Paper, Stack } from "@mui/material";
import { FutureEvents } from "./components/future-events";
import { WealthChart } from "./components/wealth-chart";
import { WealthTable } from "./components/wealth-table";

export const ProjectedWealth = () => {
  return (
    <Grid container height={"100%"} spacing={2}>
      <Grid item xs={3} height={"100%"}>
        <Paper sx={{ padding: 2, height: "100%" }}>
          <FutureEvents />
        </Paper>
      </Grid>
      <Grid item xs={9} height={"100%"}>
        <Stack spacing={2} height={"100%"}>
          <WealthChart />
          <WealthTable />
        </Stack>
      </Grid>
    </Grid>
  );
};
