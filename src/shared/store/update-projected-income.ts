import { create } from "mutative";
import { AccountData, TimeSeries } from "shared/models/store/current";
import { store } from ".";

export const updateProjectedIncome = (timeSeries: TimeSeries, data: AccountData, value: number) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const account = next.projectedIncome.timeSeries[timeSeries];
      const idx = account.findIndex((x) => x === data);
      account[idx].value = value;
    });
    return next;
  });
};
