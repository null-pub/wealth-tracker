import Grid from "@mui/system/Unstable_Grid";
import { AccountTabs } from "./components/account-tabs";
import { WealthChart } from "./components/wealth-chart";

export const NetWealth = () => {
  return (
    <Grid container height={"100%"} width="100%" spacing={1}>
      <Grid xs={12} height="50%">
        <WealthChart />
      </Grid>
      <Grid xs={12} height="50%">
        <AccountTabs />
      </Grid>
    </Grid>
  );
};
