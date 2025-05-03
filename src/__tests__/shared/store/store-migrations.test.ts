import { describe, expect, test } from "vitest";
import { Store as StoreV0 } from "../../../shared/models/store/version-0";
import { Store as StoreV5 } from "../../../shared/models/store/version-5";
import { migration } from "../../../shared/store/migrations";

describe("Store Migrations", () => {
  test("should migrate from version 0 to version 5", () => {
    const v0Store: StoreV0 = {
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
    };

    const result = migration(v0Store);

    expect(result.version).toBe(5);
    expect(result).toHaveProperty("wealth");
    expect(result).toHaveProperty("projectedIncome");
    expect(result).toHaveProperty("projectedWealth");
  });

  test("should handle migrating accounts with hidden property", () => {
    const v0Store: StoreV0 = {
      wealth: {
        testAccount: {
          type: "account",
          data: [],
        },
      },
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
    };

    const result = migration(v0Store) as StoreV5;

    expect(result.wealth.testAccount).toHaveProperty("hidden", false);
  });

  test("should handle null or undefined data", () => {
    expect(() => migration(null)).toThrow("parsed data is null or undefined");
    expect(() => migration(undefined)).toThrow("parsed data is null or undefined");
  });

  test("should handle non-object data", () => {
    expect(() => migration("invalid")).toThrow("Parsed data is not an object");
    expect(() => migration(123)).toThrow("Parsed data is not an object");
  });
});
