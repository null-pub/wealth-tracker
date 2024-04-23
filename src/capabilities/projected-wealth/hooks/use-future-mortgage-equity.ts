import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { Mortgage } from "shared/models/store/current";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { calcLoanBalance } from "shared/utility/mortgage-calc";

export const useFutureMortgageEquity = (year: number) => {
  const accounts = useStore(store, (x) => x.wealth);

  return useMemo(() => {
    const mortgages = Object.values(accounts).filter((x) => x.type === "mortgage") as Mortgage[];
    return mortgages
      .map((x) => {
        if (!x.loan) {
          return 0;
        }

        const startDate =
          getLocalDateTime() < DateTime.fromObject({ month: 1, day: 1, year })
            ? DateTime.fromObject({ month: 1, day: 1, year })
            : getLocalDateTime().endOf("month");

        return calcLoanBalance(startDate, x.loan) - calcLoanBalance(startDate.endOf("year"), x.loan);
      })
      .reduce((acc, curr) => acc + curr, 0);
  }, [accounts, year]);
};
