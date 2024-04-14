import { store } from "shared/store";
import { scenarioStore } from "../store/scenario-store";
import { create } from "mutative";
import { getLocalDateTime } from "shared/utility/current-date";
import { DateTime } from "luxon";
import { getScenarioSize } from "./merit-sequence";

const currentYear = getLocalDateTime().year;
const maxYear = currentYear + 4;

const worker = new Worker(new URL("worker.js", import.meta.url), { type: "module" });
worker.onmessage = (event) => {
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

  for (let i = oldestYear; i < currentYear; i++) {
    worker.postMessage({ year: i, projectedIncome });
  }
  for (let i = currentYear; i <= maxYear; i++) {
    if (getScenarioSize(i, projectedIncome) > 2500) {
      break;
    }
    worker.postMessage({ year: i, projectedIncome });
  }
};
loadAllScenarios();

store.subscribe(() => {
  scenarioStore.setState(() => ({ loading: false, scenarios: {}, maxYear: currentYear, minYear: currentYear }));
  loadAllScenarios();
});
