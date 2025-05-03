import { TimeSeries } from "shared/models/store/current";
import { getScenarioSize } from "shared/utility/get-scenario-size";
import { describe, expect, it } from "vitest";

describe("getScenarioSize", () => {
  const year = 2025;

  it("should return 0 when no merit sequence exists", () => {
    const mockTimeSeries: TimeSeries = {
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      paycheck: [],
      meritIncreasePct: [],
      meritBonusPct: [],
      companyBonusPct: [],
      equityPct: [],
    };

    expect(getScenarioSize(year, mockTimeSeries)).toBe(0);
  });

  it("should use current year company bonus if available", () => {
    const mockTimeSeries: TimeSeries = {
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      paycheck: [],
      meritIncreasePct: [{ date: "2025-04-01", value: 0.03 }],
      meritBonusPct: [{ date: "2025-04-01", value: 0.05 }],
      companyBonusPct: [
        { date: "2024-03-15", value: 0.1 },
        { date: "2024-03-15", value: 0.15 },
        { date: "2025-03-15", value: 0.2 }, // Current year should be used exclusively
      ],
      equityPct: [],
    };

    // 1 merit sequence * 1 company bonus percentage = 1
    expect(getScenarioSize(year, mockTimeSeries)).toBe(0);
  });

  it("should return correct size when company bonus exists for current year", () => {
    const timeSeries: TimeSeries = {
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      paycheck: [
        { date: "2024-12-15", value: 2000 },
        { date: "2025-01-15", value: 2000 },
      ],
      meritIncreasePct: [{ date: "2025-04-01", value: 0.03 }],
      meritBonusPct: [{ date: "2025-04-01", value: 0.05 }],
      companyBonusPct: [{ date: "2025-03-15", value: 0.1 }],
      equityPct: [{ date: "2025-04-01", value: 0.02 }],
    };

    const size = getScenarioSize(year, timeSeries);
    expect(size).toBe(1); // 1 merit sequence * 1 company bonus
  });

  it("should use historical company bonus percentages when no current year data exists", () => {
    const timeSeries: TimeSeries = {
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      paycheck: [
        { date: "2024-12-15", value: 2000 },
        { date: "2025-01-15", value: 2000 },
      ],
      meritIncreasePct: [{ date: "2025-04-01", value: 0.03 }],
      meritBonusPct: [{ date: "2025-04-01", value: 0.05 }],
      companyBonusPct: [
        { date: "2024-03-15", value: 0.1 },
        { date: "2024-03-15", value: 0.15 },
        { date: "2024-03-15", value: 0.12 },
      ],
      equityPct: [{ date: "2025-04-01", value: 0.02 }],
    };

    const size = getScenarioSize(year, timeSeries);
    expect(size).toBe(3); // 1 merit sequence * 3 unique company bonus percentages
  });

  it("should handle empty merit sequence", () => {
    const timeSeries: TimeSeries = {
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      paycheck: [],
      meritIncreasePct: [],
      meritBonusPct: [],
      companyBonusPct: [{ date: "2025-03-15", value: 0.1 }],
      equityPct: [],
    };

    const size = getScenarioSize(year, timeSeries);
    expect(size).toBe(0);
  });

  it("should handle empty company bonus percentages", () => {
    const timeSeries: TimeSeries = {
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      paycheck: [
        { date: "2024-12-15", value: 2000 },
        { date: "2025-01-15", value: 2000 },
      ],
      meritIncreasePct: [{ date: "2025-04-01", value: 0.03 }],
      meritBonusPct: [{ date: "2025-04-01", value: 0.05 }],
      companyBonusPct: [],
      equityPct: [{ date: "2025-04-01", value: 0.02 }],
    };

    const size = getScenarioSize(year, timeSeries);
    expect(size).toBe(0);
  });
});
