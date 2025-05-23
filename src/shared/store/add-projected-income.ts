import { DateTime } from "luxon";
import { create } from "mutative";
import { MeritData, TimeSeriesKeys } from "shared/models/store/current";
import { sortByDate } from "shared/utility/sort-by-date";
import { store } from "./store";

export const addProjectedIncome = (date: DateTime, timeSeries: TimeSeriesKeys, value: number) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      next.projectedIncome.timeSeries[timeSeries] = next.projectedIncome.timeSeries[timeSeries]
        .concat({
          date: date.startOf("day").toString(),
          value,
        })
        .sort(sortByDate((x) => DateTime.fromISO(x.date), "asc"));
    });
  });
};

export const addProjectedIncomeMeritPct = (meritDetails: MeritData) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      next.projectedIncome.timeSeries.meritPct = next.projectedIncome.timeSeries.meritPct
        .concat(meritDetails)
        .sort(sortByDate((x) => DateTime.fromISO(x.date), "asc"));
    });
  });
};
