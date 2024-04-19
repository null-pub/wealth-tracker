import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { AgGrid } from "shared/components/ag-grid";
import { Mortgage } from "shared/models/store/current";
import { store } from "shared/store";

import { findNearestOnOrBefore } from "shared/utility/find-nearest-on-or-before";
import { getGraphDates } from "shared/utility/get-graph-dates";
import { calcEquity, calcLoanBalance } from "shared/utility/mortgage-calc";

import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { AddEntry } from "./add-entry";
import { createAccountColumnConfig, mortgageColumnConfig } from "./column-config";
import { AccountSettings } from "./settings";

export const MortgageTab = (props: { accountName: string }) => {
  const { accountName } = props;

  const account = useStore(store, (state) => state.wealth[accountName]) as Mortgage;

  const allAccounts = useStore(store, (x) => x.wealth);

  const accountColumnConfig = useMemo(() => {
    return createAccountColumnConfig(accountName);
  }, [accountName]);

  const mortgageData = useMemo(() => {
    if (!account?.loan) {
      return [];
    }

    return getGraphDates(Object.values(allAccounts)).map((date) => {
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
    });
  }, [account, allAccounts]);

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
        reactiveCustomComponents
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
