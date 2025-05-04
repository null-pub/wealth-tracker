import { TimeSeries } from "shared/models/store/current";
import { getMeritSequence } from "shared/utility/get-merit-sequence";
import { describe, expect, it } from "vitest";

describe("getMeritSequence", () => {
  const baseTimeSeries: TimeSeries = {
    paycheck: [
      { date: "2023-01-01T00:00:00.000Z", value: 1000 },
      { date: "2023-06-15T00:00:00.000Z", value: 1100 },
      { date: "2024-01-01T00:00:00.000Z", value: 1200 },
    ],
    meritPct: [
      { date: "2023-06-15T00:00:00.000Z", meritIncreasePct: 0.05, meritBonusPct: 0.02, equityPct: 0.1, enabled: true },
      { date: "2024-06-15T00:00:00.000Z", meritIncreasePct: 0.04, meritBonusPct: 0.03, equityPct: 0.12, enabled: true },
    ],
    companyBonusPct: [],
    companyBonus: [],
    retirementBonus: [],
    meritBonus: [],
  };

  it("should return empty array when no recent pay data exists", () => {
    const result = getMeritSequence(2025, {
      ...baseTimeSeries,
      paycheck: [],
    });
    expect(result).toEqual([]);
  });

  it("should handle single year merit sequence", () => {
    const result = getMeritSequence(2024, baseTimeSeries);
    expect(result).toHaveLength(1);
    expect(result[0].values).toHaveLength(1);
    expect(result[0].values[0].meritIncreasePct).toBe(0.04);
    expect(result[0].values[0].meritBonusPct).toBe(0.03);
  });

  it("should handle multiple years of merit sequences", () => {
    const timeSeries: TimeSeries = {
      ...baseTimeSeries,
      meritPct: [
        { date: "2023-06-15T00:00:00.000Z", meritIncreasePct: 0.05, meritBonusPct: 0.02, equityPct: 0.1, enabled: true },
        { date: "2024-06-15T00:00:00.000Z", meritIncreasePct: 0.04, meritBonusPct: 0.03, equityPct: 0.12, enabled: true },
        { date: "2025-06-15T00:00:00.000Z", meritIncreasePct: 0.06, meritBonusPct: 0.04, equityPct: 0.15, enabled: true },
      ],
    };

    const result = getMeritSequence(2025, timeSeries);
    expect(result).toHaveLength(1);
    expect(result[0].values).toHaveLength(2);
    expect(result[0].values[0].meritIncreasePct).toBe(0.06);
    expect(result[0].values[0].meritBonusPct).toBe(0.04);
    expect(result[0].values[1].meritIncreasePct).toBe(0.06);
    expect(result[0].values[1].meritBonusPct).toBe(0.04);
  });
});
