import { DateTime } from "luxon";
import { Account, Mortgage } from "shared/models/store/current";
import { findNearestOnOrBefore } from "./find-nearest-on-or-before";
import { calcEquity, calcLoanBalance } from "./mortgage-calc";

const getMortgageValue = (date: DateTime, mortgage: Mortgage) => {
  if (!mortgage.loan) {
    return 0;
  }
  const entry = findNearestOnOrBefore(date, mortgage.data);
  if (entry?.date && mortgage.data[0] === entry && DateTime.fromISO(entry.date).startOf("day") > date) {
    return 0;
  }
  const { ownershipPct, principal } = mortgage.loan;
  const balance = calcLoanBalance(date, mortgage.loan);
  return calcEquity(ownershipPct, entry?.value, balance, principal);
};

const getAccountValue = (date: DateTime, account: Account) => {
  const entry = findNearestOnOrBefore(date, account.data);
  if (entry?.date && account.data[0] === entry && DateTime.fromISO(entry.date).startOf("day") > date) {
    return 0;
  }
  return entry?.value;
};

export const getGraphValue = (date: DateTime, account: Account | Mortgage) => {
  switch (account.type) {
    case "account":
      return getAccountValue(date, account);
    case "mortgage":
      return getMortgageValue(date, account);
  }
};
