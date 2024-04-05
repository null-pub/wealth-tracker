import { create } from "mutative";
import { store } from "./store";

export const removeAccount = (accountName: string) =>
  store.setState((prev) => {
    return create(prev, (next) => {
      delete next.wealth[accountName];
    });
  });
