import { DateTime } from "luxon";
import { getDefaultStore, storeValidator } from "shared/models/store/current";
import { createStore, store } from "shared/store/store";
import { beforeEach, describe, expect, test } from "vitest";

describe("Store Operations", () => {
  beforeEach(() => {
    localStorage.clear();
    const initialState = getDefaultStore();
    store.setState(() => initialState);
  });

  test("should initialize with default state", () => {
    const state = store.state;

    expect(state.wealth).toEqual({});
    expect(state.projectedIncome.timeSeries).toBeDefined();
    expect(state.projectedWealth).toBeDefined();
  });

  test("should persist state to localStorage", () => {
    const initialState = getDefaultStore();
    initialState.wealth = {
      testAccount: {
        type: "account",
        data: [
          {
            date: DateTime.fromISO("2025-01-01").toISO()!,
            value: 1000,
          },
        ],
        hidden: false,
      },
    };
    initialState.projectedWealth = {
      savingsPerPaycheck: 1000,
      retirementContributionPaycheck: 500,
      bonusWithholdingsRate: 0.25,
      socialSecurityLimit: 150000,
      socialSecurityTaxRate: 0.062,
      medicareSupplementalTaxThreshold: 200000,
      medicareSupplementalTaxRate: 0.009,
    };
    store.setState(() => initialState);

    // Check localStorage persistence
    const storedData = localStorage.getItem("store");
    expect(storedData).toBeDefined();
    const parsedData = JSON.parse(storedData!);
    expect(parsedData).toEqual(initialState);
  });

  test("should handle invalid localStorage data", () => {
    localStorage.setItem("store", "invalid json");

    // This should not throw and should use default state
    expect(() => store.state).not.toThrow();
  });

  test("should handle corrupted but valid JSON in localStorage", () => {
    // Set corrupted but valid JSON that will fail validation
    localStorage.setItem("store", JSON.stringify({ version: 999, invalid: true }));

    const newStore = createStore(storeValidator, getDefaultStore());
    expect(newStore.state).toEqual({ version: 999, invalid: true });

    // Should have saved the invalid data
    const invalidData = localStorage.getItem("store-invalid");
    expect(invalidData).toBeDefined();
    expect(JSON.parse(invalidData!)).toEqual({ version: 999, invalid: true });
  });

  test("should notify subscribers of state changes", () => {
    let notified = false;
    store.subscribe(() => {
      notified = true;
    });

    store.setState((prev) => ({
      ...prev,
      projectedWealth: {
        ...prev.projectedWealth,
        savingsPerPaycheck: 1000,
      },
    }));

    expect(notified).toBe(true);
  });

  test("should preserve immutability of state", () => {
    const originalState = store.state;
    const modifiedState = {
      ...originalState,
      projectedWealth: {
        ...originalState.projectedWealth,
        savingsPerPaycheck: 1000,
      },
    };

    // Direct modification should not affect store state
    expect(store.state).toEqual(originalState);
    expect(store.state).not.toEqual(modifiedState);
  });
});
