import { create } from "mutative";
import { Ratings } from "shared/models/store/current";
import { store } from ".";

type PerformanceConfigProperty = "bonusPct" | "meritIncreasePct";

export const setPerformanceConfig = (rating: Ratings, property: PerformanceConfigProperty, value: number) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      next.projectedIncome.config[rating][property] = value;
    });
  });
};
