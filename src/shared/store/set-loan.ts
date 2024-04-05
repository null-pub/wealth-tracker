import { create } from "mutative";
import { Loan } from "shared/models/loan";
import { Mortgage } from "shared/models/mortgage";
import { store } from "./store";

export const setLoan = (accountName: string, loan: Loan) =>
  store.setState((prev) => {
    return create(prev, (next) => {
      if (next.wealth[accountName].type === "mortgage") {
        (next.wealth[accountName] as Mortgage).loan = loan;
      }
    });
  });
