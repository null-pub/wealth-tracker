import { DateTime } from "luxon";
import { create } from "mutative";
import { Scenario } from "shared/models/scenario";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { getScenarioSize } from "shared/utility/get-scenario-size";
import { scenarioStore } from "../store/scenario-store";

const maxScenarioSize = 2499;
const currentYear = getLocalDateTime().year;

const maxYear = (() => {
  const timeSeries = store.state.projectedIncome.timeSeries;
  for (let i = currentYear; i <= currentYear + 5; i++) {
    const size = getScenarioSize(i, timeSeries);
    if (size > maxScenarioSize || size === 0) {
      return Math.max(currentYear, i - 1);
    }
  }
  return currentYear + 5;
})();

const workers = [
  new Worker(new URL("worker.js", import.meta.url), { type: "module", name: "1" }),
  new Worker(new URL("worker.js", import.meta.url), { type: "module", name: "2" }),
  new Worker(new URL("worker.js", import.meta.url), { type: "module", name: "3" }),
  new Worker(new URL("worker.js", import.meta.url), { type: "module", name: "4" }),
];

workers.forEach((x) => {
  x.onmessage = (event: MessageEvent<{ year: number; scenarios: Scenario[] }>) => {
    scenarioStore.setState((prev) => {
      return create(prev, (x) => {
        x.scenarios[event.data.year] = event.data.scenarios;

        const range = Object.keys(x.scenarios)
          .map((x) => +x)
          .filter((x, i, arr) => {
            return i === 0 ? true : x - arr[i - 1] === 1;
          });
        const min = range[0];
        const max = range.at(-1);

        x.loading = max !== maxYear;
        x.maxYear = max!;
        x.minYear = min;
      });
    });
  };
});

const loadAllScenarios = () => {
  const projectedIncome = store.state.projectedIncome;
  const first = projectedIncome.timeSeries.paycheck[1]?.date;
  const date = first ? DateTime.fromISO(first) : getLocalDateTime();
  const oldestYear = date.year;

  workers[0].postMessage({ year: currentYear, projectedIncome });

  let workerIdx = 1;
  for (let i = oldestYear; i < currentYear; i++) {
    const idx = workerIdx++ % workers.length;
    workers[idx].postMessage({ year: i, projectedIncome });
  }

  for (let i = currentYear + 1; i <= maxYear; i++) {
    const idx = workerIdx++ % workers.length;
    workers[idx].postMessage({ year: i, projectedIncome });
  }
};

loadAllScenarios();

let priorProjectedIncome = store.state.projectedIncome;
store.subscribe(() => {
  if (priorProjectedIncome === store.state.projectedIncome) {
    return;
  }
  priorProjectedIncome = store.state.projectedIncome;
  loadAllScenarios();
});
