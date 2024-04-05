import { DateTime } from "luxon";
import { create } from "mutative";
import { store } from ".";

export const updateAccountDate = (accountName: string, id: string, date: DateTime) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const account = next.wealth[accountName];
      const idx = account?.data.findIndex((x) => x.id === id);
      if (idx >= 0) {
        account.data[idx].date = date.toISO()!;
      }
    });
    return next;
  });
};
