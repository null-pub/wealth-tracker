import { createStore } from "@tanstack/react-store";
import { Scenario } from "shared/models/scenario";
import { getLocalDateTime } from "shared/utility/current-date";

interface ScenarioStore {
  scenarios: Partial<Record<number, Scenario[]>>;
  loading: boolean;
  minYear: number;
  maxYear: number;
}

const year = getLocalDateTime().year;
export const scenarioStore = createStore<ScenarioStore>({
  loading: true,
  maxYear: year,
  minYear: year,
  scenarios: {},
});
