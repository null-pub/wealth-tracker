import { create } from "mutative";
import { Loan, Mortgage } from "shared/models/store/current";
import { store } from "./store";

export const setLoan = (accountName: string, loan: Loan) =>
  store.setState((prev) => {
    return create(prev, (next) => {
      if (next.wealth[accountName].type === "mortgage") {
        (next.wealth[accountName] as Mortgage).loan = loan;
      }
    });
  });
