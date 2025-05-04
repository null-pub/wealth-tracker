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
      meritPct: [],
      companyBonusPct: [],
    };

    expect(getScenarioSize(year, mockTimeSeries)).toBe(0);
  });

  it("should use current year company bonus if available", () => {
    const mockTimeSeries: TimeSeries = {
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      paycheck: [
        {
          value: 1000,
          date: "2024-04-01",
        },
      ],
      meritPct: [
        {
          date: "2025-04-01",
          meritIncreasePct: 0.03,
          meritBonusPct: 0.05,
          equityPct: 0.02,
          enabled: true,
        },
      ],
      companyBonusPct: [{ date: "2025-03-15", value: 0.2 }],
    };

    expect(getScenarioSize(year, mockTimeSeries)).toBe(1);
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
      meritPct: [
        {
          date: "2025-04-01",
          meritIncreasePct: 0.03,
          meritBonusPct: 0.05,
          equityPct: 0.02,
          enabled: true,
        },
      ],
      companyBonusPct: [{ date: "2025-03-15", value: 0.1 }],
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
      meritPct: [
        {
          date: "2025-04-01",
          meritIncreasePct: 0.03,
          meritBonusPct: 0.05,
          equityPct: 0.02,
          enabled: true,
        },
      ],
      companyBonusPct: [
        { date: "2024-03-15", value: 0.1 },
        { date: "2024-03-15", value: 0.15 },
        { date: "2024-03-15", value: 0.12 },
      ],
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
      meritPct: [],
      companyBonusPct: [{ date: "2025-03-15", value: 0.1 }],
    };

    expect(getScenarioSize(year, timeSeries)).toBe(0);
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
      meritPct: [
        {
          date: "2025-04-01",
          meritIncreasePct: 0.03,
          meritBonusPct: 0.05,
          equityPct: 0.02,
          enabled: true,
        },
      ],
      companyBonusPct: [],
    };

    expect(getScenarioSize(year, timeSeries)).toBe(0);
  });
});
