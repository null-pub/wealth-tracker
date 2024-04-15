import { create } from "mutative";
import { AccountData } from "shared/models/store/current";
import { store } from "./store";

export const removeAccountEntry = (accountName: string, data: AccountData) =>
  store.setState((prev) => {
    return create(prev, (next) => {
      const idxToRemove = next.wealth[accountName].data.findIndex((x) => x === data);
      next.wealth[accountName].data.splice(idxToRemove, 1);
      return next;
    });
  });
