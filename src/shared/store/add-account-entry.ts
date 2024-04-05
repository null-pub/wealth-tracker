import { DateTime } from "luxon";
import { create } from "mutative";
import { v4 as uuid } from "uuid";
import { Account } from "../models/account";
import { sortByDate } from "../utility/sort-by-date";
import { store } from "./store";

export const AddAccountEntry = (accountName: string, date: DateTime<true>, amount: number) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      (next.wealth[accountName] as Account).data.push({
        date: date.startOf("day").toString(),
        value: amount,
        id: uuid(),
      });
      next.wealth[accountName].data.sort(sortByDate((x) => DateTime.fromISO(x.date), "asc"));
    });
  });
};
