import { DateTime } from "luxon";
import { create } from "mutative";
import { Scenario } from "shared/models/scenario";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { getScenarioSize } from "shared/utility/get-scenario-size";
import { scenarioStore } from "../store/scenario-store";

/**
 * Maximum number of data points allowed in a scenario to prevent performance issues
 * @constant {number}
 */
const maxScenarioSize = 2499;

/**
 * Current year from local system time
 * @constant {number}
 */
const currentYear = getLocalDateTime().year;

/**
 * Calculates the maximum year for scenario generation based on data size constraints
 * Looks ahead up to 5 years but stops if scenarios would become too large
 * 
 * @constant {number}
 */
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

/**
 * Pool of web workers for parallel scenario generation
 * Each worker handles generating scenarios for different years
 * 
 * @type {Worker[]}
 */
const workers = [
  new Worker(new URL("worker.js", import.meta.url), { type: "module", name: "1" }),
  new Worker(new URL("worker.js", import.meta.url), { type: "module", name: "2" }),
  new Worker(new URL("worker.js", import.meta.url), { type: "module", name: "3" }),
  new Worker(new URL("worker.js", import.meta.url), { type: "module", name: "4" }),
];

/**
 * Sets up message handlers for all workers in the pool
 * Updates scenario store when workers complete scenario generation
 */
workers.forEach((worker) =>
  worker.addEventListener("message", (e: MessageEvent<{ year: number; scenarios: Scenario[] }>) => {
    scenarioStore.setState((prev) => {
      return create(prev, (next) => {
        next.scenarios[e.data.year] = e.data.scenarios;

        // Update min/max year range based on available scenarios
        const years = Object.keys(next.scenarios).map((x) => +x);
        const min = Math.min(...years);
        next.minYear = min;
      });
    });
  }))
);

/**
 * Triggers scenario generation for all relevant years across the worker pool
 * Distributes work among available workers in a round-robin fashion
 */
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

// Initial load of all scenarios
loadAllScenarios();

// Track projected income changes to regenerate scenarios when needed
let priorProjectedIncome = store.state.projectedIncome;
store.subscribe(() => {
  if (priorProjectedIncome === store.state.projectedIncome) {
    return;
  }
  priorProjectedIncome = store.state.projectedIncome;
  loadAllScenarios();
});
