import { Box, Tab, Tabs } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";
import { store } from "shared/store";
import { NewAccount } from "./new-account";
import { AccountTab } from "./tab-types/account/account";
import { MortgageTab } from "./tab-types/mortgage";

export const AccountTabs = () => {
  const accounts = useStore(store, (x) => x.wealth);
  const firstAccount = Object.keys(accounts)?.[0];
  const [account, setAccount] = useState<string>(firstAccount);

  useEffect(() => {
    if (!accounts[account]) {
      setAccount(Object.keys(accounts)?.at(0) ?? "");
    }
  }, [account, accounts]);

  return (
    <Box display="flex" width="100%" height="100%" gap={2}>
      <Box display={"flex"} flexDirection={"column"} flex={"0 1 auto"}>
        <Tabs
          orientation="vertical"
          value={account}
          onChange={(_, value) => {
            setAccount(value as string);
          }}
        >
          {Object.entries(accounts)
            .filter(([, data]) => !data.hidden)
            .map(([account]) => {
              return <Tab key={account} value={account} label={account} />;
            })}
          <Tab component={NewAccount} />
        </Tabs>
      </Box>
      <Box flex={"1 1 auto"} overflow={"auto"}>
        {accounts[account]?.type === "account" && <AccountTab accountName={account} />}
        {accounts[account]?.type === "mortgage" && <MortgageTab accountName={account} />}
      </Box>
    </Box>
  );
};
