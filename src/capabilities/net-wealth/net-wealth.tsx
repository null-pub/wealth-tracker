import { Box } from "@mui/material";
import { AccountTabs } from "./account-tabs";
import { WealthChart } from "./wealth-chart";

export const NetWealth = () => {
  return (
    <Box display={"flex"} height="100%" width={"100%"} overflow={"hidden"} gap={2}>
      <Box flex="0 1 auto">
        <Box
          width={650}
          height={"100%"}
          sx={{
            padding: 2,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2,
            minWidth: 480,
            backgroundColor: "#121212",
            boxShadow: "2px 3px 9px 1px #12121252",
          }}
        >
          <AccountTabs />
        </Box>
      </Box>
      <Box flex="1 1 auto" overflow={"hidden"} width="100%" height={"100%"}>
        <WealthChart />
      </Box>
    </Box>
  );
};
