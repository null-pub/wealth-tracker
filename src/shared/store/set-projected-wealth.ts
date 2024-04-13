import { create } from "mutative";
import { ProjectedWealthKeys } from "shared/models/store/current";
import { store } from ".";

export const setProjectedWealth = (configName: ProjectedWealthKeys, value: number) => {
  store.setState((prev) => {
    return create(prev, (next) => {
      next.projectedWealth[configName] = value;
    });
  });
};
