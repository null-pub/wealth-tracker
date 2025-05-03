import { DateTime } from "luxon";
import { isFuture } from "shared/utility/is-future";
import { describe, expect, it } from "vitest";

describe("isFuture", () => {
  it("should return true for future dates", () => {
    const futureDate = DateTime.now().plus({ days: 1 });
    expect(isFuture(futureDate)).toBe(true);
  });

  it("should return false for past dates", () => {
    const pastDate = DateTime.now().minus({ days: 1 });
    expect(isFuture(pastDate)).toBe(false);
  });

  it("should return false for current date", () => {
    const now = DateTime.now();
    expect(isFuture(now)).toBe(false);
  });
});
