import { DateTime } from "luxon";
import { AccountData, getDefaultStore } from "shared/models/store/current";
import { store } from "shared/store/store";
import { updateAccountDate } from "shared/store/update-account-date";
import { updateProjectedIncomeDate } from "shared/store/update-projected-income-date";
import { beforeEach, describe, expect, test } from "vitest";

describe("Date Update Operations", () => {
  const testEntry: AccountData = {
    date: DateTime.fromISO("2025-01-01").toISO()!,
    value: 1000,
  };

  beforeEach(() => {
    localStorage.clear();
    const initialState = getDefaultStore();
    initialState.projectedIncome.timeSeries.paycheck = [testEntry];
    initialState.wealth = {
      testAccount: {
        type: "account",
        data: [testEntry],
        hidden: false,
      },
    };
    store.setState(() => initialState);
  });

  describe("Account Date Operations", () => {
    test("should update account entry date", () => {
      const newDate = DateTime.fromISO("2025-02-01");
      updateAccountDate("testAccount", testEntry, newDate);

      const state = store.state;
      expect(state.wealth["testAccount"].data[0].date).toBe(newDate.toISO());
    });

    test("should handle non-existent entry", () => {
      const nonExistentEntry = { ...testEntry, value: 999 };
      expect(() => updateAccountDate("testAccount", nonExistentEntry, DateTime.now())).toThrow("failed to find data");
    });

    test("should handle invalid account", () => {
      expect(() => updateAccountDate("nonExistentAccount", testEntry, DateTime.now())).toThrow();
    });
  });

  describe("Projected Income Date Operations", () => {
    test("should update projected income date", () => {
      const newDate = DateTime.fromISO("2025-02-01");
      updateProjectedIncomeDate("paycheck", testEntry, newDate);

      const state = store.state;
      expect(state.projectedIncome.timeSeries.paycheck[0].date).toBe(newDate.toISO());
    });

    test("should handle non-existent entry", () => {
      const nonExistentEntry = { ...testEntry, value: 999 };
      expect(() => updateProjectedIncomeDate("paycheck", nonExistentEntry, DateTime.now())).toThrow("failed to find data");
    });

    test("should maintain data integrity", () => {
      const newDate = DateTime.fromISO("2025-02-01");
      updateProjectedIncomeDate("paycheck", testEntry, newDate);

      const state = store.state;
      expect(state.projectedIncome.timeSeries.paycheck[0].value).toBe(testEntry.value);
    });
  });
});
