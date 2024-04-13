import { Stack } from "@mui/system";
import Grid from "@mui/system/Unstable_Grid";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { AgGrid } from "shared/components/ag-grid";
import { Mortgage } from "shared/models/store/current";
import { store } from "shared/store";

import { findNearestOnOrBefore } from "shared/utility/find-nearest-on-or-before";
import { getGraphDates } from "shared/utility/get-graph-dates";
import { calcEquity, calcLoanBalance } from "shared/utility/mortgage-calc";
import { DeleteAccount } from "../components/delete-account";
import { RenameAccount } from "../components/update-account";
import { AddEntry } from "./add-entry";
import { AddLoan } from "./add-loan";
import { createAccountColumnConfig, mortgageColumnConfig } from "./column-config";

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
    <Grid container height="100%" width={"100%"} padding={1} spacing={2}>
      <Grid lg={3}>
        <AgGrid
          reactiveCustomComponents
          rowData={account?.data ?? []}
          columnDefs={accountColumnConfig}
          id={account + "-history"}
          autoSizeStrategy={{ type: "fitGridWidth" }}
        />
      </Grid>
      <Grid lg={3}>
        <AgGrid
          rowData={mortgageData}
          columnDefs={mortgageColumnConfig}
          id={account + "-history"}
          autoSizeStrategy={{ type: "fitGridWidth" }}
        />
      </Grid>
      <Grid lg={6}>
        <div>
          <Grid container spacing={2}>
            <Grid xl={3}>
              <AddLoan accountName={accountName} />
            </Grid>
            <Grid xl={3}>
              <AddEntry accountName={accountName} />
            </Grid>
            <Grid xl={0}></Grid>
            <Grid xl={3}>
              <Stack spacing={2}>
                <DeleteAccount accountName={accountName} />
                <RenameAccount key={accountName} accountName={accountName} />
              </Stack>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};
