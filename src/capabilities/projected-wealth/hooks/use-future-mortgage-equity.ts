import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { Mortgage } from "shared/models/store/current";
import { store } from "shared/store";
import { useLocalDateTime } from "shared/utility/current-date";
import { calcLoanBalance } from "shared/utility/mortgage-calc";

/**
 * Hook that calculates the change in mortgage equity for the year
 * Considers all mortgage accounts and calculates expected principal payments
 *
 * @param {number} year - The year to calculate mortgage equity changes for
 * @returns {number} Total projected change in mortgage equity (principal payments)
 */
export const useFutureMortgageEquity = (year: number) => {
  const accounts = useStore(store, (x) => x.wealth);
  const mortgages = Object.values(accounts).filter((x) => x.type === "mortgage") as Mortgage[];
  const localDate = useLocalDateTime();
  const januaryFirstSelectedYear = DateTime.fromObject({ month: 1, day: 1, year });

  if (year < localDate.year) {
    return 0;
  }

  return mortgages
    .map((x) => {
      if (!x.loan) {
        return 0;
      }

      const startDate = localDate < januaryFirstSelectedYear ? januaryFirstSelectedYear : localDate.endOf("month");
      const endDate = startDate.endOf("year");

      return calcLoanBalance(startDate, x.loan) - calcLoanBalance(endDate, x.loan);
    })
    .reduce((acc, curr) => acc + curr, 0);
};
