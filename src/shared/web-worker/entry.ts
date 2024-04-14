import { store } from "shared/store";
import { scenarioStore } from "../store/scenario-store";
import { create } from "mutative";
import { getLocalDateTime } from "shared/utility/current-date";
import { DateTime } from "luxon";
import { getScenarioSize } from "./merit-sequence";
import { Scenario } from "shared/models/scenario";

const currentYear = getLocalDateTime().year;
const maxYear = (() => {
  const projectedIncome = store.state.projectedIncome;
  for (let i = currentYear; i <= currentYear + 10; i++) {
    if (getScenarioSize(i, projectedIncome) > 2499) {
      return Math.max(currentYear, i - 1);
    }
  }
  return currentYear + 10;
})();

const worker = new Worker(new URL("worker.js", import.meta.url), { type: "module" });
worker.onmessage = (event: MessageEvent<{ year: number; scenarios: Scenario[] }>) => {
  const isLoading = event.data.year !== maxYear;

  scenarioStore.setState((prev) => {
    return create(prev, (x) => {
      x.scenarios[event.data.year] = event.data.scenarios;
      x.loading = isLoading;
      x.maxYear = Math.max(event.data.year, x.maxYear);
      x.minYear = Math.min(event.data.year, x.minYear);
    });
  });
};

const loadAllScenarios = () => {
  const projectedIncome = store.state.projectedIncome;
  const first = projectedIncome.timeSeries.paycheck[1]?.date;
  const date = first ? DateTime.fromISO(first) : getLocalDateTime();
  const oldestYear = date.year;
  worker.postMessage({ year: 2024, projectedIncome });
  for (let i = oldestYear; i < currentYear; i++) {
    worker.postMessage({ year: i, projectedIncome });
  }
  for (let i = currentYear; i <= maxYear; i++) {
    worker.postMessage({ year: i, projectedIncome });
  }
};
loadAllScenarios();

let priorProjectedIncome = store.state.projectedIncome;
store.subscribe(() => {
  if (priorProjectedIncome === store.state.projectedIncome) {
    return;
  }
  scenarioStore.setState(() => ({ loading: false, scenarios: {}, maxYear: currentYear, minYear: currentYear }));
  priorProjectedIncome = store.state.projectedIncome;
  loadAllScenarios();
});
