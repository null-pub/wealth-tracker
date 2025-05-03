import { renderHook } from "@testing-library/react";
import { useFutureSavings } from "capabilities/projected-wealth/hooks/use-future-savings";
import { store } from "shared/store";
import { beforeEach, describe, expect, test } from "vitest";

describe("useFutureSavings", () => {
  const monthlySavings = 1000;

  beforeEach(() => {
    store.setState(() => ({
      version: 5,
      projectedWealth: {
        savingsPerMonth: monthlySavings,
        retirementContributionPaycheck: 0,
        bonusWithholdingsRate: 0,
        socialSecurityLimit: 0,
        socialSecurityTaxRate: 0,
        medicareSupplementalTaxThreshold: 0,
        medicareSupplementalTaxRate: 0,
      },
      wealth: {},
      projectedIncome: {
        timeSeries: {
          paycheck: [],
          meritIncreasePct: [],
          equityPct: [],
          meritBonusPct: [],
          meritBonus: [],
          companyBonusPct: [],
          companyBonus: [],
          retirementBonus: [],
        },
      },
    }));
  });

  test("should return correct monthly savings rate", () => {
    const { result } = renderHook(() => useFutureSavings(2025));
    expect(result.current.perMonth).toBe(monthlySavings);
  });

  test("should calculate remaining savings for current year", () => {
    const currentYear = new Date().getFullYear();
    const { result } = renderHook(() => useFutureSavings(currentYear));

    // Since this is dynamic based on current date, we just verify it's a reasonable value
    expect(result.current.remaining).toBeGreaterThanOrEqual(0);
    expect(result.current.remaining).toBeLessThanOrEqual(monthlySavings * 12);
  });

  test("should return full year savings for future years", () => {
    const futureYear = new Date().getFullYear() + 1;
    const { result } = renderHook(() => useFutureSavings(futureYear));

    expect(result.current.remaining).toBe(monthlySavings * 12);
  });

  test("should return zero for past years", () => {
    const pastYear = new Date().getFullYear() - 1;
    const { result } = renderHook(() => useFutureSavings(pastYear));

    expect(result.current.remaining).toBe(0);
  });
});
