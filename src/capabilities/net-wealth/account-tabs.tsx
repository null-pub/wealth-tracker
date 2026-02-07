import { Box, Tab, Tabs } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { useState } from "react";
import { store } from "shared/store";
import { NewAccount } from "./new-account";
import { AccountTab } from "./tab-types/account/account";
import { MortgageTab } from "./tab-types/mortgage";

export const AccountTabs = () => {
  const accounts = useStore(store, (x) => x.wealth);
  const firstAccount = Object.keys(accounts)?.[0] ?? 0;
  const [account, setAccount] = useState<string | 0>(firstAccount);
  const selectedAccount = accounts[account] ? account : firstAccount;

  return (
    <Box display="flex" width="100%" height="100%" gap={2}>
      <Box display={"flex"} flexDirection={"column"} flex={"0 1 auto"}>
        <Tabs
          orientation="vertical"
          value={selectedAccount}
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
        {typeof selectedAccount === "string" && (
          <>
            {accounts[selectedAccount]?.type === "account" && <AccountTab accountName={selectedAccount} />}
            {accounts[selectedAccount]?.type === "mortgage" && <MortgageTab accountName={selectedAccount} />}
          </>
        )}
      </Box>
    </Box>
  );
};
