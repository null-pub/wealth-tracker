import { create } from "mutative";
import { store } from "./store";

export const hideAccount = (accountName: string) =>
  store.setState((prev) => {
    return create(prev, (next) => {
      if (next.wealth[accountName]) {
        next.wealth[accountName].hidden = true;
      }
    });
  });
