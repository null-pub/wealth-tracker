import { getEligibleIncomeDateRanges } from "shared/utility/get-eligible-income-date-ranges";
import { describe, expect, it } from "vitest";

describe("getEligibleIncomeDateRanges", () => {
  const year = 2025;

  it("should return correct base date range", () => {
    const ranges = getEligibleIncomeDateRanges(year);

    expect(ranges.base.start.toISODate()).toBe("2025-01-01");
    expect(ranges.base.end.toISODate()).toBe("2025-12-31");
  });

  it("should return correct merit bonus date range (previous year)", () => {
    const ranges = getEligibleIncomeDateRanges(year);

    expect(ranges.meritBonus.start.toISODate()).toBe("2024-01-01");
    expect(ranges.meritBonus.end.toISODate()).toBe("2024-12-31");
  });

  it("should return correct company bonus date range (Apr-Mar)", () => {
    const ranges = getEligibleIncomeDateRanges(year);

    expect(ranges.companyBonus.start.toISODate()).toBe("2024-04-01");
    expect(ranges.companyBonus.end.toISODate()).toBe("2025-03-31");
  });

  it("should return correct retirement bonus date range (Jul-Jun)", () => {
    const ranges = getEligibleIncomeDateRanges(year);

    expect(ranges.retirementBonus.start.toISODate()).toBe("2024-07-01");
    expect(ranges.retirementBonus.end.toISODate()).toBe("2025-06-30");
  });

  it("should handle end-of-day timestamps correctly", () => {
    const ranges = getEligibleIncomeDateRanges(year);

    // Base range
    expect(ranges.base.start.hour).toBe(0);
    expect(ranges.base.start.minute).toBe(0);
    expect(ranges.base.end.hour).toBe(23);
    expect(ranges.base.end.minute).toBe(59);

    // Merit bonus range
    expect(ranges.meritBonus.start.hour).toBe(0);
    expect(ranges.meritBonus.start.minute).toBe(0);
    expect(ranges.meritBonus.end.hour).toBe(23);
    expect(ranges.meritBonus.end.minute).toBe(59);

    // Company bonus range
    expect(ranges.companyBonus.start.hour).toBe(0);
    expect(ranges.companyBonus.start.minute).toBe(0);
    expect(ranges.companyBonus.end.hour).toBe(23);
    expect(ranges.companyBonus.end.minute).toBe(59);

    // Retirement bonus range
    expect(ranges.retirementBonus.start.hour).toBe(0);
    expect(ranges.retirementBonus.start.minute).toBe(0);
    expect(ranges.retirementBonus.end.hour).toBe(23);
    expect(ranges.retirementBonus.end.minute).toBe(59);
  });
});
