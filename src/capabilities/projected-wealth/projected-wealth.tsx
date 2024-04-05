import { Grid, Paper } from "@mui/material";
import { Config } from "./components/config";
import { FutureEvents } from "./components/future-events";
import { WealthChart } from "./components/wealth-chart";
import { WealthTable } from "./components/wealth-table";

export const ProjectedWealth = () => {
  return (
    <Grid container height={"100%"} spacing={2}>
      <Grid item xs={6} height={"50%"}>
        <WealthChart />
      </Grid>
      <Grid item xs={6} height={"50%"}>
        <Paper sx={{ padding: 2, height: "100%" }}>
          <Config />
        </Paper>
      </Grid>
      <Grid item xs={6} height={"50%"}>
        <WealthTable />
      </Grid>
      <Grid item xs={6} height={"50%"}>
        <Paper sx={{ padding: 2, height: "100%" }}>
          <FutureEvents />
        </Paper>
      </Grid>
    </Grid>
  );
};
