import { DateTime } from "luxon";
import { PaymentTypes } from "shared/models/payment-periods";
import { getDefaultStore, ProjectedIncome, Store } from "shared/models/store/current";
import { applyBonuses, buildBaseScenarios, getScenarioDates } from "shared/utility/scenario-generation";
import { beforeEach, describe, expect, it } from "vitest";

describe("scenario-generation", () => {
  const year = 2025;

  describe("getScenarioDates", () => {
    it("should return default dates when no actual dates exist", () => {
      const defaultStore = getDefaultStore();
      const dates = getScenarioDates(year, defaultStore.projectedIncome);

      expect(dates.meritIncrease.year).toBe(year);
      expect(dates.meritIncrease.month).toBe(4); // April
      expect(dates.meritBonus.year).toBe(year);
      expect(dates.meritBonus.month).toBe(4); // April
      expect(dates.companyBonus.year).toBe(year);
      expect(dates.companyBonus.month).toBe(6); // June
      expect(dates.retirement.year).toBe(year);
      expect(dates.retirement.month).toBe(7); // July
    });

    it("should use actual dates when they exist", () => {
      const defaultStore = getDefaultStore();
      const mockProjectedIncome = {
        ...defaultStore.projectedIncome,
        timeSeries: {
          meritBonus: [{ date: "2025-05-15", value: 1000 }],
          companyBonus: [{ date: "2025-06-15", value: 5000 }],
          retirementBonus: [{ date: "2025-11-15", value: 2000 }],
          paycheck: [],
          meritPct: [],
          companyBonusPct: [],
        },
      };

      const dates = getScenarioDates(year, mockProjectedIncome);

      expect(dates.meritBonus.toISO()?.split("T")[0]).toBe("2025-05-15");
      expect(dates.companyBonus.toISO()?.split("T")[0]).toBe("2025-06-15");
      expect(dates.retirement.toISO()?.split("T")[0]).toBe("2025-11-15");
    });
  });

  describe("buildBaseScenarios", () => {
    let mockTimeSeries: ProjectedIncome["timeSeries"];
    let mockDates: ReturnType<typeof getScenarioDates>;
    let defaultStore: Store;

    beforeEach(() => {
      defaultStore = getDefaultStore();

      mockTimeSeries = {
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
      defaultStore.projectedIncome.timeSeries = mockTimeSeries;

      mockDates = {
        meritIncrease: DateTime.fromISO("2025-04-01").toValid(),
        meritBonus: DateTime.fromISO("2025-04-15").toValid(),
        companyBonus: DateTime.fromISO("2025-03-15").toValid(),
        retirement: DateTime.fromISO("2025-12-15").toValid(),
      };
    });

    it("should generate base scenarios with merit and company bonus factors", () => {
      const scenarios = buildBaseScenarios(year, defaultStore.projectedIncome, mockDates);

      expect(scenarios.length).toBeGreaterThan(0);
      expect(scenarios[0]).toHaveProperty("weight");
      expect(scenarios[0]).toHaveProperty("companyBonusFactor");
      expect(scenarios[0]).toHaveProperty("meritIncreasePct");
      expect(scenarios[0]).toHaveProperty("meritBonusPct");
    });

    it("should use historical company bonus percentages when no current year data exists", () => {
      mockTimeSeries.companyBonusPct = [
        { date: "2024-03-15", value: 0.1 },
        { date: "2024-03-15", value: 0.15 },
        { date: "2024-03-15", value: 0.12 },
      ];

      const scenarios = buildBaseScenarios(year, defaultStore.projectedIncome, mockDates);

      expect(scenarios.length).toBeGreaterThan(0);
      const uniqueFactors = new Set(scenarios.map((s) => s.companyBonusFactor));
      expect(uniqueFactors.size).toBe(3); // Should have all 3 historical values
      expect(scenarios.some((s) => s.companyBonusFactor === 0.1)).toBe(true);
      expect(scenarios.some((s) => s.companyBonusFactor === 0.15)).toBe(true);
      expect(scenarios.some((s) => s.companyBonusFactor === 0.12)).toBe(true);
    });
  });

  describe("applyBonuses", () => {
    it("should calculate payments for each scenario", () => {
      const mockScenario = {
        year,
        weight: 1,
        companyBonusFactor: 0.1,
        lastThreeMeritBonusFactor: 0.15,
        meritBonusPct: 0.05,
        meritIncreasePct: 0.03,
        equityIncreasePct: 0.02,
        retirementBonusPct: 0.15,
        totalPay: 0,
        basePay: 0,
        meritBonus: 0,
        companyBonus: 0,
        retirementBonus: 0,
        companyBonusPct: 0,
        taxablePay: 0,
        aprToApr: 0,
        currentPaymentIdx: 0,
        remainingRegularPayments: 0,
        payments: [
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 0,
            payedOn: "2025-04-15",
            start: "2025-04-01",
            end: "2025-04-30",
          },
        ],
        pay: [{ date: "2025-01-15", value: 2000 }],
        lastThreeMeritBonuses: [0, 0, 0],
      };

      const mockDates = {
        meritIncrease: DateTime.fromISO("2025-04-01"),
        meritBonus: DateTime.fromISO("2025-04-15"),
        companyBonus: DateTime.fromISO("2025-03-15"),
        retirement: DateTime.fromISO("2025-12-15"),
      };

      const mockDateRanges = {
        base: {
          start: DateTime.fromISO("2025-01-01").toValid(),
          end: DateTime.fromISO("2025-12-31").toValid(),
        },
        meritBonus: {
          start: DateTime.fromISO("2024-01-01").toValid(),
          end: DateTime.fromISO("2024-12-31").toValid(),
        },
        companyBonus: {
          start: DateTime.fromISO("2024-04-01").toValid(),
          end: DateTime.fromISO("2025-03-31").toValid(),
        },
        retirementBonus: {
          start: DateTime.fromISO("2024-07-01").toValid(),
          end: DateTime.fromISO("2025-06-30").toValid(),
        },
      };

      const result = applyBonuses([mockScenario], mockDates, mockDateRanges, {});
      expect(result[0].basePay).toBe(2000);
      expect(result[0].totalPay).toBe(2300);
      expect(result[0].taxablePay).toBe(2000);
    });
  });
});
