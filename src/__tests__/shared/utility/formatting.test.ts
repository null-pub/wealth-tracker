import { clamp } from "shared/utility/clamp";
import { formatCash, formatCashShort } from "shared/utility/format-cash";
import { monthDay, shortDate } from "shared/utility/format-date";
import { formatPercent, formatPercentKatex } from "shared/utility/format-percent";
import { describe, expect, it } from "vitest";

describe("clamp", () => {
  it("should clamp values between min and max", () => {
    expect(clamp(0, 5, 10)).toBe(5);
    expect(clamp(0, -5, 10)).toBe(0);
    expect(clamp(0, 15, 10)).toBe(10);
  });
});

describe("formatCash", () => {
  it("should format numbers as USD currency", () => {
    expect(formatCash(1234.56)).toBe("$1,235");
    expect(formatCash(1000000)).toBe("$1,000,000");
    expect(formatCash(0)).toBe("$0");
    expect(formatCash(-1234.56)).toBe("-$1,235");
  });
});

describe("formatCashShort", () => {
  it("should format numbers as compact USD currency", () => {
    expect(formatCashShort(1234)).toBe("$1.23K");
    expect(formatCashShort(1000000)).toBe("$1.00M");
    expect(formatCashShort(0)).toBe("$0.00");
    expect(formatCashShort(-1234)).toBe("-$1.23K");
  });
});

describe("formatDate", () => {
  it("should have correct date formats", () => {
    expect(shortDate).toBe("yyyy-MM-dd");
    expect(monthDay).toBe("MMM dd");
  });
});

describe("formatPercent", () => {
  it("should format numbers as percentages", () => {
    expect(formatPercent(0.1234)).toBe("12.3%");
    expect(formatPercent(1)).toBe("100%");
    expect(formatPercent(0)).toBe("0%");
    expect(formatPercent(-0.1234)).toBe("-12.3%");
  });
});

describe("formatPercentKatex", () => {
  it("should format numbers as Katex percentages", () => {
    expect(formatPercentKatex(0.1234)).toBe("12.3\\%");
    expect(formatPercentKatex(1)).toBe("100\\%");
    expect(formatPercentKatex(0)).toBe("0\\%");
    expect(formatPercentKatex(-0.1234)).toBe("-12.3\\%");
  });
});
