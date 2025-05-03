import { DateTime } from "luxon";
import { beforeEach, describe, expect, test } from "vitest";
import { AccountData } from "../../../shared/models/store/current";
import { removeAccountEntry } from "../../../shared/store/remove-account-entry";
import { store } from "../../../shared/store/store";

describe("Account Entry Operations", () => {
  const testEntry: AccountData = {
    date: DateTime.fromISO("2025-01-01").toISO()!,
    value: 1000,
  };

  beforeEach(() => {
    localStorage.clear();
    store.setState(() => ({
      version: 5,
      wealth: {
        testAccount: {
          type: "account",
          data: [testEntry],
          hidden: false,
        },
      },
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

  test("should remove account entry", () => {
    removeAccountEntry("testAccount", testEntry);
    const state = store.state;
    expect(state.wealth["testAccount"].data).toHaveLength(0);
  });

  test("should handle non-existent account", () => {
    expect(() => removeAccountEntry("nonExistentAccount", testEntry)).toThrow();
  });

  test("should handle non-existent entry", () => {
    const nonExistentEntry = { ...testEntry, value: 999 };
    expect(() => removeAccountEntry("testAccount", nonExistentEntry)).toThrow("failed to find data");
  });

  test("should maintain other entries when removing one", () => {
    const secondEntry: AccountData = {
      date: DateTime.fromISO("2025-02-01").toISO()!,
      value: 2000,
    };

    store.setState((prev) => ({
      ...prev,
      wealth: {
        ...prev.wealth,
        testAccount: {
          ...prev.wealth.testAccount,
          data: [...prev.wealth.testAccount.data, secondEntry],
        },
      },
    }));

    removeAccountEntry("testAccount", testEntry);

    const state = store.state;
    expect(state.wealth["testAccount"].data).toHaveLength(1);
    expect(state.wealth["testAccount"].data[0]).toEqual(secondEntry);
  });
});
