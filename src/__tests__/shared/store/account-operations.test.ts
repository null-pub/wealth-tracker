import { DateTime } from "luxon";
import { beforeEach, describe, expect, test } from "vitest";
import { AccountData } from "../../../shared/models/store/current";
import { hideAccount } from "../../../shared/store/hide-account";
import { setLoan } from "../../../shared/store/set-loan";
import { store } from "../../../shared/store/store";
import { updateAccountValue } from "../../../shared/store/update-account-value";

describe("Account Operations", () => {
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

  test("should hide account", () => {
    hideAccount("testAccount");
    const state = store.state;
    expect(state.wealth.testAccount.hidden).toBe(true);
  });

  test("should handle non-existent account", () => {
    hideAccount("nonexistent");
    const state = store.state;
    expect(state.wealth.nonexistent).toBeUndefined();
  });

  test("should update account value", () => {
    updateAccountValue("testAccount", testEntry, 2000);
    const state = store.state;
    expect(state.wealth.testAccount.data[0].value).toBe(2000);
  });

  test("should throw error when updating non-existent account", () => {
    expect(() => updateAccountValue("nonexistent", testEntry, 2000)).toThrow();
  });

  test("should throw error when updating non-existent entry", () => {
    const nonExistentEntry = { ...testEntry, date: DateTime.fromISO("2024-01-01").toISO()! };
    expect(() => updateAccountValue("testAccount", nonExistentEntry, 2000)).toThrow();
  });

  test("should maintain entry order after update", () => {
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

    updateAccountValue("testAccount", testEntry, 3000);

    const state = store.state;
    expect(state.wealth.testAccount.data).toEqual([{ ...testEntry, value: 3000 }, secondEntry]);
  });
});

describe("Loan Operations", () => {
  const validLoan = {
    principal: 300000,
    ratePct: 4.5,
    paymentsPerYear: 12,
    payment: 1500,
    firstPaymentDate: DateTime.fromISO("2025-01-01").toISO()!,
    ownershipPct: 100,
  };

  beforeEach(() => {
    localStorage.clear();
    store.setState(() => ({
      version: 5,
      wealth: {
        testMortgage: {
          type: "mortgage" as const,
          data: [],
          hidden: false,
          loan: undefined,
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

  test("should set loan for mortgage account", () => {
    setLoan("testMortgage", validLoan);
    const state = store.state;
    const mortgage = state.wealth["testMortgage"];
    if (mortgage.type === "mortgage") {
      expect(mortgage.loan).toEqual(validLoan);
    }
  });

  test("should handle non-mortgage account", () => {
    store.setState((prev) => ({
      ...prev,
      wealth: {
        ...prev.wealth,
        normalAccount: {
          type: "account" as const,
          data: [],
          hidden: false,
        },
      },
    }));

    expect(() => setLoan("normalAccount", validLoan)).not.toThrow();
    const state = store.state;
    expect(state.wealth["normalAccount"]).not.toHaveProperty("loan");
  });

  test("should update existing loan", () => {
    setLoan("testMortgage", validLoan);
    const updatedLoan = { ...validLoan, ratePct: 5.0 };
    setLoan("testMortgage", updatedLoan);
    const state = store.state;
    const mortgage = state.wealth["testMortgage"];
    if (mortgage.type === "mortgage") {
      expect(mortgage.loan).toEqual(updatedLoan);
    }
  });
});
