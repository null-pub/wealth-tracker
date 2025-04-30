import { DateTime } from "luxon";
import { Account, Mortgage } from "shared/models/store/current";

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
