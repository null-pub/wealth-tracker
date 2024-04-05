import { create } from "mutative";
import { ProjectedWealthConfig } from "shared/models/projected-wealth";
import { store } from ".";

export const setProjectedWealth = (configName: ProjectedWealthConfig, value: number) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      next.projectedWealth[configName] = value;
    });
  });
};
