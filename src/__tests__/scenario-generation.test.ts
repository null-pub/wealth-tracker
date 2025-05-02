import { DateTime } from "luxon";
import { PaymentTypes } from "shared/models/payment-periods";
import { ProjectedIncome } from "shared/models/store/current";
import { applyBonuses, buildBaseScenarios, getScenarioDates } from "shared/utility/scenario-generation";
import { beforeEach, describe, expect, it } from "vitest";

describe("scenario-generation", () => {
  const year = 2025;

  describe("getScenarioDates", () => {
    it("should use default dates when no actual dates exist", () => {
      const mockProjectedIncome: ProjectedIncome = {
        timeSeries: {
          meritBonus: [],
          companyBonus: [],
          retirementBonus: [],
          paycheck: [],
          meritIncreasePct: [],
          meritBonusPct: [],
          companyBonusPct: [],
          equityPct: [],
        },
      };

      const dates = getScenarioDates(year, mockProjectedIncome);

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
      const mockProjectedIncome: ProjectedIncome = {
        timeSeries: {
          meritBonus: [{ date: "2025-05-15", value: 1000 }],
          companyBonus: [{ date: "2025-06-15", value: 5000 }],
          retirementBonus: [{ date: "2025-11-15", value: 2000 }],
          paycheck: [],
          meritIncreasePct: [],
          meritBonusPct: [],
          companyBonusPct: [],
          equityPct: [],
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

    beforeEach(() => {
      mockTimeSeries = {
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

      mockDates = {
        meritIncrease: DateTime.fromISO("2025-04-01").toValid(),
        meritBonus: DateTime.fromISO("2025-04-15").toValid(),
        companyBonus: DateTime.fromISO("2025-03-15").toValid(),
        retirement: DateTime.fromISO("2025-12-15").toValid(),
      };
    });

    it("should generate base scenarios with merit and company bonus factors", () => {
      const scenarios = buildBaseScenarios(year, mockTimeSeries, mockDates);

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

      const scenarios = buildBaseScenarios(year, mockTimeSeries, mockDates);

      expect(scenarios.length).toBeGreaterThan(0);
      const uniqueFactors = new Set(scenarios.map((s) => s.companyBonusFactor));
      expect(uniqueFactors.size).toBe(3); // Should have all 3 historical values
      expect(scenarios.some((s) => s.companyBonusFactor === 0.1)).toBe(true);
      expect(scenarios.some((s) => s.companyBonusFactor === 0.15)).toBe(true);
      expect(scenarios.some((s) => s.companyBonusFactor === 0.12)).toBe(true);
    });
  });

  describe("applyBonuses", () => {
    it("should calculate and apply bonuses correctly", () => {
      const mockScenario = {
        year,
        weight: 1,
        companyBonusFactor: 0.1,
        lastThreeMeritBonusFactor: 0.15,
        meritBonusPct: 0.05,
        payments: [
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 2000,
            payedOn: "2024-03-15",
            start: "2024-03-01",
            end: "2024-03-31",
          },
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 4000,
            payedOn: "2024-04-15",
            start: "2024-04-01",
            end: "2024-04-30",
          },
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 6000,
            payedOn: "2024-12-15",
            start: "2024-12-01",
            end: "2024-12-31",
          },
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 8000,
            payedOn: "2025-01-15",
            start: "2025-01-01",
            end: "2025-01-31",
          },
        ],
        pay: [
          { value: 2000, date: "2024-03-15" },
          { value: 2000, date: "2024-04-15" },
          { value: 2000, date: "2024-12-15" },
          { value: 2000, date: "2025-01-15" },
        ],
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

      expect(result.length).toBe(1);
      const scenario = result[0];

      // Verify bonuses were calculated and applied
      expect(scenario.meritBonus).toBeGreaterThan(0);
      expect(scenario.companyBonus).toBeGreaterThan(0);
      expect(scenario.retirementBonus).toBeGreaterThan(0);

      // Verify payments were updated
      expect(scenario.payments.length).toBe(7); // Original 4 payments + 3 bonuses
      expect(scenario.payments.filter((p) => p.type === PaymentTypes.bonus).length).toBe(2);
      expect(scenario.payments.filter((p) => p.type === PaymentTypes.nonTaxableBonus).length).toBe(1);

      // Verify totals
      expect(scenario.totalPay).toBe(scenario.basePay + scenario.meritBonus + scenario.companyBonus + scenario.retirementBonus);
    });

    it("should use provided bonus values when available", () => {
      const mockScenario = {
        year,
        weight: 1,
        companyBonusFactor: 0.1,
        lastThreeMeritBonusFactor: 0.15,
        meritBonusPct: 0.05,
        payments: [
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 2000,
            payedOn: "2024-03-15",
            start: "2024-03-01",
            end: "2024-03-31",
          },
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 4000,
            payedOn: "2024-04-15",
            start: "2024-04-01",
            end: "2024-04-30",
          },
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 6000,
            payedOn: "2024-12-15",
            start: "2024-12-01",
            end: "2024-12-31",
          },
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 8000,
            payedOn: "2025-01-15",
            start: "2025-01-01",
            end: "2025-01-31",
          },
        ],
        pay: [
          { value: 2000, date: "2024-03-15" },
          { value: 2000, date: "2024-04-15" },
          { value: 2000, date: "2024-12-15" },
          { value: 2000, date: "2025-01-15" },
        ],
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

      const providedBonuses = {
        meritBonus: 1000,
        companyBonus: 5000,
        retirementBonus: 2000,
      };

      const result = applyBonuses([mockScenario], mockDates, mockDateRanges, providedBonuses);

      expect(result[0].meritBonus).toBe(providedBonuses.meritBonus);
      expect(result[0].companyBonus).toBe(providedBonuses.companyBonus);
      expect(result[0].retirementBonus).toBe(providedBonuses.retirementBonus);
    });

    it("should throw error when required scenario fields are missing", () => {
      const mockScenario = {
        year,
        weight: 1,
        companyBonusFactor: 0.1,
        // Missing lastThreeMeritBonusFactor
        meritBonusPct: 0.05,
        payments: [],
      };

      const mockDates = {
        meritIncrease: DateTime.fromISO("2025-04-01"),
        meritBonus: DateTime.fromISO("2025-04-15"),
        companyBonus: DateTime.fromISO("2025-03-15"),
        retirement: DateTime.fromISO("2025-12-15"),
      };

      const mockDateRanges = {
        base: {
          start: DateTime.fromISO("2025-01-01"),
          end: DateTime.fromISO("2025-12-31"),
        },
        meritBonus: {
          start: DateTime.fromISO("2024-01-01"),
          end: DateTime.fromISO("2024-12-31"),
        },
        companyBonus: {
          start: DateTime.fromISO("2024-04-01"),
          end: DateTime.fromISO("2025-03-31"),
        },
        retirementBonus: {
          start: DateTime.fromISO("2024-07-01"),
          end: DateTime.fromISO("2025-06-30"),
        },
      };

      expect(() => applyBonuses([mockScenario], mockDates, mockDateRanges, {})).toThrow("Scenario lastThreeMeritBonusFactor is undefined");
    });

    it("should handle currentPaymentIdx calculation correctly", () => {
      const mockScenario = {
        year,
        weight: 1,
        companyBonusFactor: 0.1,
        lastThreeMeritBonusFactor: 0.15,
        meritBonusPct: 0.05,
        payments: [
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 2000,
            payedOn: "2024-03-15",
            start: "2024-03-01",
            end: "2024-03-31",
          },
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 4000,
            payedOn: "2025-04-15",
            start: "2025-04-01",
            end: "2025-04-30",
          },
          {
            type: PaymentTypes.regular,
            value: 2000,
            cumulative: 6000,
            payedOn: "2025-05-15",
            start: "2025-05-01",
            end: "2025-05-31",
          },
        ],
        pay: [
          { value: 2000, date: "2024-03-15" },
          { value: 2000, date: "2025-04-15" },
          { value: 2000, date: "2025-05-15" },
        ],
      };

      const mockDates = {
        meritIncrease: DateTime.fromISO("2025-04-01"),
        meritBonus: DateTime.fromISO("2025-04-15"),
        companyBonus: DateTime.fromISO("2025-03-15"),
        retirement: DateTime.fromISO("2025-12-15"),
      };

      const mockDateRanges = {
        base: {
          start: DateTime.fromISO("2025-01-01"),
          end: DateTime.fromISO("2025-12-31"),
        },
        meritBonus: {
          start: DateTime.fromISO("2024-01-01"),
          end: DateTime.fromISO("2024-12-31"),
        },
        companyBonus: {
          start: DateTime.fromISO("2024-04-01"),
          end: DateTime.fromISO("2025-03-31"),
        },
        retirementBonus: {
          start: DateTime.fromISO("2024-07-01"),
          end: DateTime.fromISO("2025-06-30"),
        },
      };

      const result = applyBonuses([mockScenario], mockDates, mockDateRanges, {});

      expect(result.length).toBe(1);
      const scenario = result[0];

      // Should find index of payment just before current date (May 2, 2025)
      expect(scenario.currentPaymentIdx).toBe(3); // Original payments + company bonus + merit bonus, but not May payment
      expect(scenario.remainingRegularPayments).toBe(1); // Only the May 15th payment is after current date
    });
  });
});
