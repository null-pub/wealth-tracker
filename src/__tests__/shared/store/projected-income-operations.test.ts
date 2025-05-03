import { DateTime } from "luxon";
import { AccountData, getDefaultStore, TimeSeriesKeys } from "shared/models/store/current";
import { removeProjectedIncome } from "shared/store/remove-projected-income";
import { store } from "shared/store/store";
import { updateProjectedIncome } from "shared/store/update-projected-income";
import { beforeEach, describe, expect, test } from "vitest";

describe("Projected Income Operations", () => {
  const testEntry: AccountData = {
    date: DateTime.fromISO("2025-01-01").toISO()!,
    value: 1000,
  };

  beforeEach(() => {
    localStorage.clear();
    const initialState = getDefaultStore();
    initialState.projectedIncome.timeSeries.paycheck.push(testEntry);
    store.setState(() => initialState);
  });

  describe("Remove Projected Income", () => {
    test("should remove projected income entry", () => {
      removeProjectedIncome("paycheck", testEntry);
      const state = store.state;
      expect(state.projectedIncome.timeSeries.paycheck).toHaveLength(0);
    });

    test("should handle non-existent time series", () => {
      const invalidKey = "nonexistent" as TimeSeriesKeys;
      expect(() => removeProjectedIncome(invalidKey, testEntry)).toThrow();
    });

    test("should handle non-existent entry", () => {
      const nonExistentEntry = { ...testEntry, value: 999 };
      expect(() => removeProjectedIncome("paycheck", nonExistentEntry)).toThrow("failed to find data");
    });

    test("should maintain other entries when removing one", () => {
      const secondEntry: AccountData = {
        date: DateTime.fromISO("2025-02-01").toISO()!,
        value: 2000,
      };

      store.setState((prev) => ({
        ...prev,
        projectedIncome: {
          ...prev.projectedIncome,
          timeSeries: {
            ...prev.projectedIncome.timeSeries,
            paycheck: [...prev.projectedIncome.timeSeries.paycheck, secondEntry],
          },
        },
      }));

      removeProjectedIncome("paycheck", testEntry);

      const state = store.state;
      expect(state.projectedIncome.timeSeries.paycheck).toHaveLength(1);
      expect(state.projectedIncome.timeSeries.paycheck[0]).toEqual(secondEntry);
    });
  });

  describe("Update Projected Income", () => {
    test("should update projected income value", () => {
      const updatedValue = 2000;
      updateProjectedIncome("paycheck", testEntry, updatedValue);

      const state = store.state;
      expect(state.projectedIncome.timeSeries.paycheck[0].value).toBe(updatedValue);
    });

    test("should not change the date when updating value", () => {
      const updatedValue = 2000;
      updateProjectedIncome("paycheck", testEntry, updatedValue);

      const state = store.state;
      expect(state.projectedIncome.timeSeries.paycheck[0].date).toBe(testEntry.date);
    });

    test("should handle non-existent entry", () => {
      const nonExistentEntry = { ...testEntry, value: 999 };
      expect(() => updateProjectedIncome("paycheck", nonExistentEntry, 2000)).toThrow("failed to find data");
    });

    test("should handle percentage values", () => {
      const percentEntry: AccountData = {
        date: DateTime.fromISO("2025-01-01").toISO()!,
        value: 0.05,
      };

      store.setState((prev) => ({
        ...prev,
        projectedIncome: {
          ...prev.projectedIncome,
          timeSeries: {
            ...prev.projectedIncome.timeSeries,
            meritIncreasePct: [percentEntry],
          },
        },
      }));

      const updatedValue = 0.1;
      updateProjectedIncome("meritIncreasePct", percentEntry, updatedValue);

      const state = store.state;
      expect(state.projectedIncome.timeSeries.meritIncreasePct[0].value).toBe(updatedValue);
    });
  });
});
