import { DateTime } from "luxon";
import { Account, Mortgage } from "shared/models/store/current";
import { getGraphValue } from "shared/utility/get-graph-value";
import { describe, expect, it } from "vitest";

describe("get-graph-value", () => {
  describe("account values", () => {
    const account: Account = {
      type: "account",
      data: [
        { date: "2023-01-01", value: 1000 },
        { date: "2023-06-01", value: 2000 },
        { date: "2023-12-01", value: 3000 },
      ],
      hidden: false,
    };

    it("should return 0 if date is before first entry", () => {
      const date = DateTime.fromISO("2022-12-31");
      expect(getGraphValue(date, account)).toBe(0);
    });

    it("should return exact value for matching date", () => {
      const date = DateTime.fromISO("2023-06-01");
      expect(getGraphValue(date, account)).toBe(2000);
    });

    it("should return nearest previous value for dates between entries", () => {
      const date = DateTime.fromISO("2023-08-01");
      expect(getGraphValue(date, account)).toBe(2000);
    });
  });

  describe("mortgage values", () => {
    const mortgage: Mortgage = {
      type: "mortgage",
      data: [
        { date: "2023-01-01", value: 500000 },
        { date: "2023-06-01", value: 550000 },
        { date: "2023-12-01", value: 600000 },
      ],
      loan: {
        ownershipPct: 1,
        principal: 400000,
        // Add missing required parameters
        firstPaymentDate: "2023-02-01", // First payment is typically a month after start
        paymentsPerYear: 12,
        ratePct: 0.05,
        payment: 2147.29, // Monthly payment for 400k @ 5% for 30 years
      },
    };

    it("should return 0 if mortgage has no loan", () => {
      const date = DateTime.fromISO("2023-06-01");
      const mortgageWithoutLoan: Mortgage = { ...mortgage, loan: undefined };
      expect(getGraphValue(date, mortgageWithoutLoan)).toBe(0);
    });

    it("should return 0 if date is before first entry", () => {
      const date = DateTime.fromISO("2022-12-31");
      expect(getGraphValue(date, mortgage)).toBe(0);
    });

    it("should calculate equity based on appraisal value and loan balance", () => {
      const date = DateTime.fromISO("2023-06-01");
      const value = getGraphValue(date, mortgage);
      expect(value).toBeGreaterThan(0);

      expect(value).toBeCloseTo(151934.54, 2);
    });

    it("should handle partial ownership", () => {
      const date = DateTime.fromISO("2023-06-01");
      const partialMortgage: Mortgage = {
        ...mortgage,
        loan: { ...mortgage.loan!, ownershipPct: 0.5 },
      };
      const value = getGraphValue(date, partialMortgage);

      expect(value).toBeCloseTo(-123065.46, 2);
    });
  });
});
