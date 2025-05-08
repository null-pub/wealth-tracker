import { DateTime } from "luxon";
import { Account, Mortgage } from "shared/models/store/current";

/**
 * Gets a sorted array of unique dates from account data entries
 * Used for generating timeline data for graphs and charts
 *
 * @param {(Account | Mortgage)[]} accounts - Array of account or mortgage objects to extract dates from
 * @returns {DateTime<true>[]} Array of valid DateTime objects sorted chronologically
 */
export const useGraphDates = (accounts: (Account | Mortgage)[]) => {
  return [
    ...new Set(
      accounts.flatMap((x) => {
        return x.data.map((x) => DateTime.fromISO(x.date).startOf("day").toISO());
      })
    ),
  ]
    .map((x) => DateTime.fromISO(x!))
    .sort((a, b) => a.toMillis() - b.toMillis()) as DateTime<true>[];
};
