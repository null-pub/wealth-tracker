import { DateTime } from "luxon";
import { create } from "mutative";
import { AccountData, TimeSeries } from "shared/models/store/current";
import { store } from ".";

export const updateProjectedIncomeDate = (timeSeries: TimeSeries, data: AccountData, date: DateTime) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const account = next.projectedIncome.timeSeries[timeSeries];
      const idx = account.findIndex((x) => x === data);
      if (idx < 0) {
        throw new Error("failed to find data");
      }

      account[idx].date = date.toISO()!;
    });
    return next;
  });
};
