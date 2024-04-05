import { create } from "mutative";
import { store } from "./store";

export const updateAccountName = (currentAccountName: string, newAccountName: string) =>
  store.setState((prev) => {
    return create(prev, (next) => {
      next.wealth[newAccountName] = next.wealth[currentAccountName];
      delete next.wealth[currentAccountName];
    });
  });
