import { DateTime } from "luxon";
import { create } from "mutative";
import { TimeSeries } from "shared/models/projected-income";
import { sortByDate } from "shared/utility/sort-by-date";
import { v4 as uuid } from "uuid";
import { store } from "./store";

export const addProjectedIncome = (date: DateTime, timeSeries: TimeSeries, value: number) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      next.projectedIncome.timeSeries[timeSeries] = next.projectedIncome.timeSeries[timeSeries]
        .concat({
          date: date.startOf("day").toString(),
          value,
          id: uuid(),
        })
        .sort(sortByDate((x) => DateTime.fromISO(x.date), "asc"));
    });
  });
};
