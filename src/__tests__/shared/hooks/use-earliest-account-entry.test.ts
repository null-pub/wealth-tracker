import { renderHook } from "@testing-library/react";
import { DateTime } from "luxon";
import { useEarliestAccountEntry } from "shared/hooks/use-earliest-account-entry";
import { store } from "shared/store";
import { beforeEach, describe, expect, test } from "vitest";

describe("useEarliestAccountEntry", () => {
  beforeEach(() => {
    store.setState(() => ({
      version: 5,
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
      projectedWealth: {
        savingsPerMonth: 0,
        retirementContributionPaycheck: 0,
        bonusWithholdingsRate: 0,
        socialSecurityLimit: 0,
        socialSecurityTaxRate: 0,
        medicareSupplementalTaxThreshold: 0,
        medicareSupplementalTaxRate: 0,
      },
    }));
  });

  test("should return current date when no accounts exist", () => {
    const { result } = renderHook(() => useEarliestAccountEntry());
    expect(result.current.toISODate()).toBe(DateTime.now().toISODate());
  });

  test("should find earliest date among all accounts", () => {
    const earliestDate = "2023-01-01";
    const laterDate = "2024-01-01";

    store.setState((prev) => ({
      ...prev,
      wealth: {
        account1: {
          type: "account",
          data: [
            { date: earliestDate, value: 1000 },
            { date: laterDate, value: 2000 },
          ],
          hidden: false,
        },
        account2: {
          type: "account",
          data: [{ date: laterDate, value: 3000 }],
          hidden: false,
        },
      },
    }));

    const { result } = renderHook(() => useEarliestAccountEntry());
    expect(result.current.toISODate()).toBe(earliestDate);
  });

  test("should handle empty account data arrays", () => {
    store.setState((prev) => ({
      ...prev,
      wealth: {
        account1: {
          type: "account",
          data: [],
          hidden: false,
        },
      },
    }));

    const { result } = renderHook(() => useEarliestAccountEntry());
    expect(result.current.toISODate()).toBe(DateTime.now().toISODate());
  });

  test("should handle mixed account types", () => {
    const earliestDate = "2023-01-01";

    store.setState((prev) => ({
      ...prev,
      wealth: {
        account1: {
          type: "account",
          data: [{ date: earliestDate, value: 1000 }],
          hidden: false,
        },
        loan1: {
          type: "mortgage",
          data: [{ date: "2024-01-01", value: 2000 }],
          hidden: false,
        },
      },
    }));

    const { result } = renderHook(() => useEarliestAccountEntry());
    expect(result.current.toISODate()).toBe(earliestDate);
  });
});
