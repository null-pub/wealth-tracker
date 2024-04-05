import { create } from "mutative";
import { TimeSeries } from "shared/models/projected-income";
import { store } from ".";

export const removeProjectedIncome = (accountName: TimeSeries, id: string) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      const idxToRemove = next.projectedIncome.timeSeries[accountName].findIndex((x) => x.id === id);
      next.projectedIncome.timeSeries[accountName].splice(idxToRemove, 1);
    });
  });
};
