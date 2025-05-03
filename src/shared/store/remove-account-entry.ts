import { create } from "mutative";
import { AccountData } from "shared/models/store/current";
import { store } from "./store";

export const removeAccountEntry = (accountName: string, data: AccountData) =>
  store.setState((prev) => {
    return create(prev, (next) => {
      const idx = prev.wealth[accountName]?.data.findIndex((x) => x === data);
      if (idx === undefined || idx < 0) {
        throw new Error("failed to find data");
      }

      next.wealth[accountName].data.splice(idx, 1);
      return next;
    });
  });
