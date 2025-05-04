import { create } from "mutative";
import { AccountData, MeritData, TimeSeriesKeys } from "shared/models/store/current";
import { store } from ".";

export const removeProjectedIncome = (accountName: TimeSeriesKeys, data: AccountData) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      const idx = prev.projectedIncome.timeSeries[accountName]?.findIndex((x) => x === data);
      if (idx === undefined || idx < 0) {
        throw new Error("failed to find data");
      }

      next.projectedIncome.timeSeries[accountName].splice(idx, 1);
    });
  });
};

export const removeProjectedIncomeMerit = (data: MeritData) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      const idx = prev.projectedIncome.timeSeries.meritPct?.findIndex((x) => x === data);
      if (idx === undefined || idx < 0) {
        throw new Error("failed to find data");
      }

      next.projectedIncome.timeSeries.meritPct.splice(idx, 1);
    });
  });
};
