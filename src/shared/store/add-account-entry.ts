import { DateTime } from "luxon";
import { create } from "mutative";
import { Account } from "shared/models/store/current";
import { sortByDate } from "../utility/sort-by-date";
import { store } from "./store";

export const addAccountEntry = (accountName: string, date: DateTime<true>, amount: number) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      (next.wealth[accountName] as Account).data.push({
        date: date.startOf("day").toString(),
        value: amount,
      });
      next.wealth[accountName].data.sort(sortByDate((x) => DateTime.fromISO(x.date), "asc"));
    });
  });
};
