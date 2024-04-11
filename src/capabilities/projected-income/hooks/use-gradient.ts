import { ckmeans } from "simple-statistics";
import { useScenarios } from "./use-scenarios";

export const useGradient2 = () => {
  const scenarios = useScenarios(2026);

  const ck = ckmeans(
    scenarios.map((x) => x.totalPay),
    Math.min(3, scenarios.length)
  );
  console.log(
    scenarios,
    "ckmeans",
    ck,
    ck.map((x) => [Math.min(...x), Math.max(...x), x.length / scenarios.length])
  );
};
