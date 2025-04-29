import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { AgGrid } from "shared/components/ag-grid";
import { Mortgage } from "shared/models/store/current";
import { store } from "shared/store";
import { findNearestOnOrBefore } from "shared/utility/find-nearest-on-or-before";
import { getGraphDates } from "shared/utility/get-graph-dates";
import { calcEquity, calcLoanBalance } from "shared/utility/mortgage-calc";
import { AddEntry } from "./add-entry";
import { createAccountColumnConfig, mortgageColumnConfig } from "./column-config";
import { AccountSettings } from "./settings";

function createLoanValueGetter(account: Mortgage) {
  return (date: DateTime) => {
    const loanBalance = calcLoanBalance(date, account.loan!);
    return {
      date,
      balance: loanBalance,
      equity: calcEquity(
        account.loan!.ownershipPct,
        findNearestOnOrBefore(date, account.data)?.value,
        loanBalance,
        account.loan!.principal
      ),
    };
  };
}

export const MortgageTab = (props: { accountName: string }) => {
  const { accountName } = props;
  const account = useStore(store, (state) => state.wealth[accountName]) as Mortgage;
  const allAccounts = useStore(store, (x) => x.wealth);
  const accountColumnConfig = createAccountColumnConfig(accountName);
  const accounts = Object.values(allAccounts);
  const dates = getGraphDates(accounts);
  const mortgageData = account.loan ? dates.map(createLoanValueGetter(account)) : [];

  return (
    <Stack height="100%" spacing={2}>
      <Stack direction={"row"}>
        <Typography variant="h5">{accountName}</Typography>
        <Box sx={{ marginLeft: "auto" }}>
          <AccountSettings key={accountName} accountName={accountName} />
        </Box>
      </Stack>
      <AddEntry accountName={accountName} />
      <AgGrid
        rowData={account?.data ?? []}
        columnDefs={accountColumnConfig}
        id={account + "-history"}
        autoSizeStrategy={{ type: "fitGridWidth" }}
      />

      <AgGrid
        rowData={mortgageData}
        columnDefs={mortgageColumnConfig}
        id={account + "-history"}
        autoSizeStrategy={{ type: "fitGridWidth" }}
      />
    </Stack>
  );
};
