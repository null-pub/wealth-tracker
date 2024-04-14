import { TimeSpanValue } from "capabilities/projected-wealth/hooks/use-projected-pay";
import { DateTime } from "luxon";
import { AccountData } from "shared/models/account-data";

export const valueByDateRange = (account: AccountData[]): TimeSpanValue[] => {
  return account.map((x, index, array) => {
    const next = array[index + 1];
    return {
      start: DateTime.fromISO(x.date),
      end: (next?.date ? DateTime.fromISO(next?.date).startOf("day") : DateTime.fromISO(x.date).plus({ years: 1 }))
        .minus({ days: 1 })
        .endOf("day"),
      value: x.value,
    };
  });
};
