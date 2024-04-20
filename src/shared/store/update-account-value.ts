import { create } from "mutative";
import { AccountData } from "shared/models/store/current";
import { store } from ".";

export const updateAccountValue = (accountName: string, data: AccountData, value: number) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const idx = prev.wealth[accountName]?.data.findIndex((x) => x === data);
      if (idx < 0) {
        throw new Error("failed to find data");
      }

      next.wealth[accountName].data[idx].value = value;
    });
    return next;
  });
};
