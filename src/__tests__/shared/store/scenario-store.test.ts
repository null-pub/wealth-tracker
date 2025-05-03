import { DateTime } from "luxon";
import { PaymentTypes } from "shared/models/payment-periods";
import { scenarioStore } from "shared/store/scenario-store";
import { beforeEach, describe, expect, test } from "vitest";

describe("Scenario Store Operations", () => {
  const mockScenarios = {
    2025: [
      {
        year: 2025,
        totalPay: 150000,
        basePay: 100000,
        meritBonus: 5000,
        companyBonus: 10000,
        retirementBonus: 2000,
        companyBonusFactor: 0.25,
        companyBonusPct: 0.1,
        pay: [
          {
            date: DateTime.fromISO("2025-01-01").toISO()!,
            value: 3846.15,
          },
        ],
        lastThreeMeritBonusFactor: 0.75,
        lastThreeMeritBonuses: [0.25, 0.25, 0.25],
        meritBonusPct: 0.05,
        meritIncreasePct: 0.03,
        payments: [
          {
            start: DateTime.fromISO("2025-01-01").toISO()!,
            end: DateTime.fromISO("2025-01-15").toISO()!,
            payedOn: DateTime.fromISO("2025-01-15").toISO()!,
            value: 3846.15,
            cumulative: 3846.15,
            type: PaymentTypes.regular,
          },
        ],
        equityIncreasePct: 0.02,
        retirementBonusPct: 0.15,
        aprToApr: 100000,
        taxablePay: 115000,
        currentPaymentIdx: 0,
        remainingRegularPayments: 26,
        weight: 1,
      },
    ],
  };

  beforeEach(() => {
    scenarioStore.setState(() => ({
      loading: false,
      scenarios: {},
      maxYear: 2025,
      minYear: 2025,
    }));
  });

  test("should initialize with default state", () => {
    const state = scenarioStore.state;
    expect(state.loading).toBe(false);
    expect(state.scenarios).toEqual({});
    expect(state.maxYear).toBe(2025);
    expect(state.minYear).toBe(2025);
  });

  test("should update scenarios", () => {
    scenarioStore.setState(() => ({
      loading: false,
      scenarios: mockScenarios,
      maxYear: 2025,
      minYear: 2025,
    }));

    const state = scenarioStore.state;
    expect(state.scenarios).toEqual(mockScenarios);
  });

  test("should update loading state", () => {
    scenarioStore.setState((prev) => ({
      ...prev,
      loading: true,
    }));

    const state = scenarioStore.state;
    expect(state.loading).toBe(true);
  });

  test("should update year range", () => {
    scenarioStore.setState((prev) => ({
      ...prev,
      minYear: 2024,
      maxYear: 2026,
    }));

    const state = scenarioStore.state;
    expect(state.minYear).toBe(2024);
    expect(state.maxYear).toBe(2026);
  });
});
