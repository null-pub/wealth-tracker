import { create } from "mutative";
import { AccountData } from "shared/models/store/current";
import { store } from ".";

export const updateAccountValue = (accountName: string, data: AccountData, value: number) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const account = next.wealth[accountName];
      const idx = account?.data.findIndex((x) => x === data);
      if (idx >= 0) {
        account.data[idx].value = value;
      }
    });
    return next;
  });
};
