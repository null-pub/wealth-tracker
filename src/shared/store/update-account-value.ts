import { create } from "mutative";
import { store } from ".";

export const updateAccountValue = (accountName: string, id: string, value: number) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const account = next.wealth[accountName];
      const idx = account?.data.findIndex((x) => x.id === id);
      if (idx >= 0) {
        account.data[idx].value = value;
      }
    });
    return next;
  });
};
