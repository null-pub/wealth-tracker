import { DateTime } from "luxon";
import { Scenario } from "shared/models/scenario";
import { getThresholdTaxRemaining } from "shared/utility/get-threshold-tax-remaining";
import { describe, expect, it, vi } from "vitest";

describe("getThresholdTaxRemaining", () => {
  vi.mock("shared/utility/current-date", () => {
    return {
      getLocalDateTime: () => DateTime.fromObject({ year: 2025, month: 2, day: 14 }),
    };
  });

  it("should return 0 if no payments are above threshold", () => {
    const scenario: Scenario = {
      currentPaymentIdx: 0,
      payments: [
        { cumulative: 5000, value: 1000, payedOn: "2025-02-15", type: "regular", start: "", end: "" },
        { cumulative: 6000, value: 1000, payedOn: "2025-03-15", type: "regular", start: "", end: "" },
      ],
      remainingRegularPayments: 2,
      pay: [],
      year: 2025,
      totalPay: 6000,
      basePay: 6000,
      meritBonus: 0,
      companyBonus: 0,
      retirementBonus: 0,
      meritBonusPct: 0,
      companyBonusPct: 0,
      companyBonusFactor: 0,
      equityIncreasePct: 0,
      meritIncreasePct: 0,
      lastThreeMeritBonusFactor: 0,
      lastThreeMeritBonuses: [],
      retirementBonusPct: 0,
      aprToApr: 6000,
      taxablePay: 6000,
      weight: 1,
    };

    const result = getThresholdTaxRemaining(0.062, 10000, scenario);
    expect(result).toBe(0);
  });

  it("should calculate tax only on amount above threshold for future payments", () => {
    const scenario: Scenario = {
      currentPaymentIdx: 0,
      payments: [
        { cumulative: 9000, value: 1000, payedOn: "2025-02-15", type: "regular", start: "", end: "" },
        { cumulative: 11000, value: 2000, payedOn: "2025-03-15", type: "regular", start: "", end: "" },
      ],
      remainingRegularPayments: 2,
      pay: [],
      year: 2025,
      totalPay: 11000,
      basePay: 11000,
      meritBonus: 0,
      companyBonus: 0,
      retirementBonus: 0,
      meritBonusPct: 0,
      companyBonusPct: 0,
      companyBonusFactor: 0,
      equityIncreasePct: 0,
      meritIncreasePct: 0,
      lastThreeMeritBonusFactor: 0,
      lastThreeMeritBonuses: [],
      retirementBonusPct: 0,
      aprToApr: 11000,
      taxablePay: 11000,
      weight: 1,
    };

    // Second payment goes 1000 over threshold (11000 - 10000)
    // Tax rate of 0.062 * 1000 = 62
    const result = getThresholdTaxRemaining(0.062, 10000, scenario);
    expect(result).toBe(62);
  });

  it("should ignore past payments", () => {
    const scenario: Scenario = {
      currentPaymentIdx: 1,
      payments: [
        { cumulative: 11000, value: 2000, payedOn: "2024-12-15", type: "regular", start: "", end: "" },
        { cumulative: 12000, value: 1000, payedOn: "2025-02-15", type: "regular", start: "", end: "" },
      ],
      remainingRegularPayments: 1,
      pay: [],
      year: 2025,
      totalPay: 12000,
      basePay: 12000,
      meritBonus: 0,
      companyBonus: 0,
      retirementBonus: 0,
      meritBonusPct: 0,
      companyBonusPct: 0,
      companyBonusFactor: 0,
      equityIncreasePct: 0,
      meritIncreasePct: 0,
      lastThreeMeritBonusFactor: 0,
      lastThreeMeritBonuses: [],
      retirementBonusPct: 0,
      aprToApr: 12000,
      taxablePay: 12000,
      weight: 1,
    };

    // Only considers the second payment which is 1000 over threshold
    // Tax rate of 0.062 * 1000 = 62
    const result = getThresholdTaxRemaining(0.062, 11000, scenario);
    expect(result).toBe(62);
  });
});
