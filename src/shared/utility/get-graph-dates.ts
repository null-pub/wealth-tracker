import { DateTime } from "luxon";
import { Account } from "shared/models/account";
import { Mortgage } from "shared/models/mortgage";

export const getGraphDates = (accounts: (Account | Mortgage)[]) => {
  return [
    ...new Set(
      accounts.flatMap((x) => {
        return x.data.map((x) => DateTime.fromISO(x.date).startOf("day").toISO());
      }),
    ),
  ]
    .map((x) => DateTime.fromISO(x!))
    .sort((a, b) => a.toMillis() - b.toMillis()) as DateTime<true>[];
};
