import { Store } from "@tanstack/store";
import { Scenario } from "shared/models/scenario";
import { getLocalDateTime } from "shared/utility/current-date";

export interface ScenarioStore {
  scenarios: Partial<Record<number, Scenario[]>>;
  loading: boolean;
  minYear: number;
  maxYear: number;
}

const year = getLocalDateTime().year;
export const scenarioStore = new Store<ScenarioStore>({
  loading: true,
  maxYear: year,
  minYear: year,
  scenarios: {},
});
