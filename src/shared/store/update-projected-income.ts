import { create } from "mutative";
import { TimeSeries } from "shared/models/store/current";
import { store } from ".";

export const updateProjectedIncome = (timeSeries: TimeSeries, id: string, value: number) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const account = next.projectedIncome.timeSeries[timeSeries];
      const idx = account.findIndex((x) => x.id === id);
      account[idx].value = value;
    });
    return next;
  });
};
