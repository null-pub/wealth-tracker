import { ProjectedIncome } from "shared/models/store/current";
import { getScenarios } from "./scenarios";

self.onmessage = (event: MessageEvent<{ year: number; projectedIncome: ProjectedIncome }>) => {
  console.log("generating scenarios for ", event.data.year);
  const scenarios = getScenarios(event.data.year, event.data.projectedIncome);
  self.postMessage({ year: event.data.year, scenarios });
};
