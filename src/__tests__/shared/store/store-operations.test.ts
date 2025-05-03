import { DateTime } from "luxon";
import { beforeEach, describe, expect, test } from "vitest";
import { addAccountEntry } from "../../../shared/store/add-account-entry";
import { removeAccount } from "../../../shared/store/remove-account";
import { store } from "../../../shared/store/store";
import { updateAccountName } from "../../../shared/store/update-account-name";
import { updateAccountValue } from "../../../shared/store/update-account-value";

describe("Store Operations", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset store to initial state
    store.setState(() => ({
      version: 5,
      wealth: {},
      projectedIncome: {
        timeSeries: {
          paycheck: [],
          meritBonusPct: [],
          companyBonusPct: [],
          meritIncreasePct: [],
          equityPct: [],
          meritBonus: [],
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

  describe("Account Operations", () => {
    test("should add account entry", () => {
      const date = DateTime.fromISO("2025-01-01").toValid();
      const amount = 1000;
      const accountName = "TestAccount";

      // Add initial account
      store.setState((prev) => ({
        ...prev,
        wealth: {
          ...prev.wealth,
          [accountName]: {
            type: "account",
            data: [],
            hidden: false,
          },
        },
      }));

      addAccountEntry(accountName, date, amount);

      const state = store.state;
      expect(state.wealth[accountName].data).toHaveLength(1);
      expect(state.wealth[accountName].data[0].value).toBe(amount);
      expect(state.wealth[accountName].data[0].date).toBe(date.startOf("day").toString());
    });

    test("should remove account", () => {
      const accountName = "TestAccount";

      // Add account first
      store.setState((prev) => ({
        ...prev,
        wealth: {
          ...prev.wealth,
          [accountName]: {
            type: "account",
            data: [],
            hidden: false,
          },
        },
      }));

      removeAccount(accountName);

      const state = store.state;
      expect(state.wealth[accountName]).toBeUndefined();
    });

    test("should update account name", () => {
      const oldName = "OldAccount";
      const newName = "NewAccount";
      const testData = { type: "account" as const, data: [], hidden: false };

      // Add account with old name
      store.setState((prev) => ({
        ...prev,
        wealth: {
          ...prev.wealth,
          [oldName]: testData,
        },
      }));

      updateAccountName(oldName, newName);

      const state = store.state;
      expect(state.wealth[oldName]).toBeUndefined();
      expect(state.wealth[newName]).toEqual(testData);
    });

    test("should update account value", () => {
      const accountName = "TestAccount";
      const initialValue = 1000;
      const newValue = 2000;
      const date = DateTime.fromISO("2025-01-01").startOf("day").toString();
      const testData = { date, value: initialValue };

      // Add account with initial data
      store.setState((prev) => ({
        ...prev,
        wealth: {
          ...prev.wealth,
          [accountName]: {
            type: "account",
            data: [testData],
            hidden: false,
          },
        },
      }));

      updateAccountValue(accountName, testData, newValue);

      const state = store.state;
      expect(state.wealth[accountName].data[0].value).toBe(newValue);
    });
  });
});
