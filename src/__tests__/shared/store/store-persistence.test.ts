import { getDefaultStore, storeValidator } from "shared/models/store/current";
import { Store as storeV0 } from "shared/models/store/version-0";
import { createStore, store } from "shared/store/store";
import { beforeEach, describe, expect, test } from "vitest";

describe("Store Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
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

  test("should persist store state to localStorage", () => {
    const testState = getDefaultStore();
    store.setState(() => testState);

    const storedData = localStorage.getItem("store");
    expect(storedData).not.toBeNull();

    const parsedData = JSON.parse(storedData!);
    expect(parsedData).toEqual(testState);
  });

  test("should keep previous state in localStorage", () => {
    const initialState = getDefaultStore();
    store.setState(() => initialState);

    const updatedState = {
      ...initialState,
      wealth: {
        testAccount: {
          type: "account" as const,
          data: [],
          hidden: false,
        },
      },
    };
    store.setState(() => updatedState);

    const previousState = localStorage.getItem("store-previous");
    expect(previousState).not.toBeNull();
    expect(JSON.parse(previousState!)).toEqual(initialState);
  });

  test("should migrate data from old version", () => {
    // Set v0 store data in localStorage
    const v0Data = {
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
        socialSecurityLimit: 0,
        socialSecurityTaxRate: 0,
        medicareSupplementalTaxThreshold: 0,
        medicareSupplementalTaxRate: 0,
      },
    } satisfies storeV0;
    localStorage.setItem("store", JSON.stringify(v0Data));

    // Creating new store should migrate the data
    const newStore = createStore(storeValidator, getDefaultStore());

    expect(newStore.state.version).toBe(5);
  });

  test("should handle invalid JSON in localStorage", () => {
    localStorage.setItem("store", "invalid json{");
    const state = store.state;
    expect(state.version).toBe(5);
  });

  test("should handle missing localStorage data", () => {
    localStorage.removeItem("store");
    const state = store.state;
    expect(state.version).toBe(5);
  });

  test("should handle localStorage.getItem throwing error", () => {
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = () => {
      throw new Error("Storage access denied");
    };

    const state = store.state;
    expect(state.version).toBe(5);

    localStorage.getItem = originalGetItem;
  });

  test("should handle localStorage.setItem throwing error", () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error("Storage quota exceeded");
    };

    store.setState((prev) => ({ ...prev, projectedWealth: { ...prev.projectedWealth, savingsPerMonth: 1000 } }));
    const state = store.state;
    expect(state.projectedWealth.savingsPerMonth).toBe(1000);

    localStorage.setItem = originalSetItem;
  });

  test("should notify subscribers of state changes", () => {
    let notified = false;
    const unsubscribe = store.subscribe(() => {
      notified = true;
    });

    store.setState((prev) => ({
      ...prev,
      projectedWealth: { ...prev.projectedWealth, savingsPerMonth: 1000 },
    }));

    expect(notified).toBe(true);
    unsubscribe();
  });

  test("should handle unsubscribe correctly", () => {
    let notified = false;
    const unsubscribe = store.subscribe(() => {
      notified = true;
    });

    unsubscribe();

    store.setState((prev) => ({
      ...prev,
      projectedWealth: { ...prev.projectedWealth, savingsPerMonth: 1000 },
    }));

    expect(notified).toBe(false);
  });
});
