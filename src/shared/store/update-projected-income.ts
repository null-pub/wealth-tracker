import { create } from "mutative";
import { AccountData, MeritData, TimeSeriesKeys } from "shared/models/store/current";
import { store } from ".";

export const updateProjectedIncome = (timeSeries: TimeSeriesKeys, data: AccountData, value: number) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const idx = prev.projectedIncome.timeSeries[timeSeries].findIndex((x) => x === data);
      if (idx < 0) {
        throw new Error("failed to find data");
      }
      next.projectedIncome.timeSeries[timeSeries][idx].value = value;
    });
    return next;
  });
};

export const updateProjectedIncomeMerit = (current: MeritData, replacement: MeritData) => {
  store.setState((prev) => {
    const next = create(prev, (next) => {
      const idx = prev.projectedIncome.timeSeries.meritPct.findIndex((x) => x === current);
      if (idx < 0) {
        throw new Error("failed to find data");
      }
      next.projectedIncome.timeSeries.meritPct[idx] = replacement;
    });
    return next;
  });
};
