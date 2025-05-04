import { TimeSeries } from "shared/models/store/current";
import { getEmptyMeritSequence } from "shared/utility/get-empty-merit-sequence";
import { describe, expect, it } from "vitest";

describe("get-empty-merit-sequence", () => {
  const year = 2024;
  const baseTimeSeries: TimeSeries = {
    paycheck: [
      { date: "2023-01-02", value: 5000 },
      { date: "2023-06-01", value: 5500 },
      { date: "2023-12-01", value: 6000 },
    ],
    meritPct: [
      { date: "2023-01-02", meritIncreasePct: 0.03, meritBonusPct: 0.05, equityPct: 0.1, enabled: true },
      { date: "2024-01-02", meritIncreasePct: 0.04, meritBonusPct: 0.06, equityPct: 0.12, enabled: true },
    ],
    companyBonusPct: [],
    companyBonus: [],
    retirementBonus: [],
    meritBonus: [],
  };

  it("should create a merit sequence with default values when no matches found", () => {
    const timeSeries: TimeSeries = {
      ...baseTimeSeries,
      meritPct: [],
    };

    const result = getEmptyMeritSequence(year, timeSeries, timeSeries.paycheck);

    expect(result.year).toBe(year);
    expect(result.meritIncreasePct).toBe(0);
    expect(result.meritBonusPct).toBe(0);
    expect(result.equityIncreasePct).toBe(0);
    expect(result.retirementBonusPct).toBe(0.15);
    expect(result.weight).toBe(1);
    expect(result.pay).toEqual(timeSeries.paycheck);
    expect(result.lastThreeMeritBonuses).toEqual([0, 0, 0]);
    expect(result.lastThreeMeritBonusFactor).toBe(0);
    expect(result.payments.length).toBeGreaterThan(0);
  });

  it("should use matching values from time series", () => {
    const result = getEmptyMeritSequence(2024, baseTimeSeries, baseTimeSeries.paycheck);

    expect(result.year).toBe(2024);
    expect(result.meritIncreasePct).toBe(0.04);
    expect(result.meritBonusPct).toBe(0.06);
    expect(result.equityIncreasePct).toBe(0.12);
    expect(result.retirementBonusPct).toBe(0.15);
    expect(result.weight).toBe(1);
    expect(result.pay).toEqual(baseTimeSeries.paycheck);
    expect(result.lastThreeMeritBonuses).toEqual([0.05, 0.05, 0.05]);
    expect(result.lastThreeMeritBonusFactor).toBeCloseTo(0.15);
    expect(result.payments.length).toBeGreaterThan(0);
  });

  it("should handle empty pay array", () => {
    const result = getEmptyMeritSequence(year, baseTimeSeries, []);

    expect(result.year).toBe(year);
    expect(result.pay).toEqual([]);
    expect(result.lastThreeMeritBonuses).toEqual([]);
    expect(result.lastThreeMeritBonusFactor).toBe(0);
    expect(result.payments.length).toBe(52);
  });
});
