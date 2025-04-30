import { DateTime } from "luxon";
import { create } from "mutative";
import { AccountData, TimeSeriesKeys } from "shared/models/store/current";
import { store } from ".";

export const updateProjectedIncomeDate = (timeSeries: TimeSeriesKeys, data: AccountData, date: DateTime) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const idx = prev.projectedIncome.timeSeries[timeSeries].findIndex((x) => x === data);
      if (idx < 0) {
        throw new Error("failed to find data");
      }

      next.projectedIncome.timeSeries[timeSeries][idx].date = date.toISO()!;
    });
    return next;
  });
};
