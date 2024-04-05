import { DateTime } from "luxon";
import { create } from "mutative";
import { TimeSeries } from "shared/models/projected-income";
import { store } from ".";

export const updateProjectedIncomeDate = (timeSeries: TimeSeries, id: string, date: DateTime) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const account = next.projectedIncome.timeSeries[timeSeries];
      const idx = account.findIndex((x) => x.id === id);
      account[idx].date = date.toISO()!;
    });
    return next;
  });
};
