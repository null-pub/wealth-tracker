import { getDefaultStore, TimeSeries } from "shared/models/store/current";
import { getScenarioSize } from "shared/utility/get-scenario-size";
import { describe, expect, it } from "vitest";

describe("getScenarioSize", () => {
  const year = 2025;

  it("should return 0 when no merit sequence exists", () => {
    const defaultStore = getDefaultStore();
    const mockTimeSeries: TimeSeries = {
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      paycheck: [],
      meritPct: [],
      companyBonusPct: [],
    };
    defaultStore.projectedIncome.timeSeries = mockTimeSeries;

    expect(getScenarioSize(year, defaultStore.projectedIncome)).toBe(0);
  });

  it("should use current year company bonus if available", () => {
    const defaultStore = getDefaultStore();
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
    defaultStore.projectedIncome.timeSeries = mockTimeSeries;

    expect(getScenarioSize(year, defaultStore.projectedIncome)).toBe(1);
  });

  it("should return correct size when company bonus exists for current year", () => {
    const defaultStore = getDefaultStore();
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
    defaultStore.projectedIncome.timeSeries = timeSeries;

    const size = getScenarioSize(year, defaultStore.projectedIncome);
    expect(size).toBe(1); // 1 merit sequence * 1 company bonus
  });

  it("should use historical company bonus percentages when no current year data exists", () => {
    const defaultStore = getDefaultStore();
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
    defaultStore.projectedIncome.timeSeries = timeSeries;
    const size = getScenarioSize(year, defaultStore.projectedIncome);
    expect(size).toBe(3); // 1 merit sequence * 3 unique company bonus percentages
  });

  it("should handle empty merit sequence", () => {
    const defaultStore = getDefaultStore();
    const timeSeries: TimeSeries = {
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      paycheck: [],
      meritPct: [],
      companyBonusPct: [{ date: "2025-03-15", value: 0.1 }],
    };

    defaultStore.projectedIncome.timeSeries = timeSeries;
    expect(getScenarioSize(year, defaultStore.projectedIncome)).toBe(0);
  });

  it("should handle empty company bonus percentages", () => {
    const defaultStore = getDefaultStore();
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

    defaultStore.projectedIncome.timeSeries = timeSeries;
    expect(getScenarioSize(year, defaultStore.projectedIncome)).toBe(0);
  });
});
