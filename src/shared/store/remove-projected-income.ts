import { create } from "mutative";
import { AccountData, TimeSeriesKeys } from "shared/models/store/current";
import { store } from ".";

export const removeProjectedIncome = (accountName: TimeSeriesKeys, data: AccountData) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      const idx = prev.projectedIncome.timeSeries[accountName].findIndex((x) => x === data);
      if (idx < 0) {
        throw new Error("failed to find data");
      }

      next.projectedIncome.timeSeries[accountName].splice(idx, 1);
    });
  });
};
