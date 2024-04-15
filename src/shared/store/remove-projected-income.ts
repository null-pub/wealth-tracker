import { create } from "mutative";
import { AccountData, TimeSeries } from "shared/models/store/current";
import { store } from ".";

export const removeProjectedIncome = (accountName: TimeSeries, data: AccountData) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      const idxToRemove = next.projectedIncome.timeSeries[accountName].findIndex((x) => x === data);
      next.projectedIncome.timeSeries[accountName].splice(idxToRemove, 1);
    });
  });
};
