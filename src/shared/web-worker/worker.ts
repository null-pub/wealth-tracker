import { ProjectedIncome } from "shared/models/store/current";
import { getScenarios } from "./scenarios";

self.onmessage = (event: MessageEvent<{ year: number; projectedIncome: ProjectedIncome }>) => {
  console.log("worker", self.name, "generating scenarios for ", event.data.year);
  const startTime = performance.now();
  const scenarios = getScenarios(event.data.year, event.data.projectedIncome);
  const endTime = performance.now();
  console.log(
    "worker",
    self.name,
    `generating ${scenarios.length} scenarios took ${Math.round(endTime - startTime)} milliseconds`
  );

  self.postMessage({ year: event.data.year, scenarios });
};
