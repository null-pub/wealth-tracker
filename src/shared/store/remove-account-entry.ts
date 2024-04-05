import { create } from "mutative";
import { store } from "./store";

export const removeAccountEntry = (accountName: string, id: string) =>
  store.setState((prev) => {
    return create(prev, (next) => {
      const idxToRemove = next.wealth[accountName].data.findIndex((x) => x.id === id);
      next.wealth[accountName].data.splice(idxToRemove, 1);
      return next;
    });
  });
