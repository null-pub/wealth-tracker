import { DateTime } from "luxon";
import { create } from "mutative";
import { AccountData } from "shared/models/store/current";
import { store } from ".";

export const updateAccountDate = (accountName: string, data: AccountData, date: DateTime) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const account = next.wealth[accountName];
      const idx = account?.data.findIndex((x) => x === data);
      if (idx < 0) {
        throw new Error("failed to find data");
      }

      account.data[idx].date = date.toISO()!;
    });
    return next;
  });
};
