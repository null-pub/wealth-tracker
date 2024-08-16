import { create } from "mutative";
import { store } from "./store";

export const hideAccount = (accountName: string) =>
  store.setState((prev) => {
    return create(prev, (next) => {
      next.wealth[accountName].hidden = true;
    });
  });
