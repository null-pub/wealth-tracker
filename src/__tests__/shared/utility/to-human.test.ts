import { Duration } from "luxon";
import { toHuman } from "shared/utility/to-human";
import { describe, expect, it } from "vitest";

describe("toHuman", () => {
  it("should format duration with all units", () => {
    const duration = Duration.fromObject({
      years: 1,
      months: 2,
      days: 3,
      hours: 4,
      minutes: 5,
      seconds: 6,
      milliseconds: 7,
    });
    expect(toHuman(duration)).toBe("1 year 2 months 3 days 4 hours 5 minutes 6 seconds");
  });

  it("should format duration with only some units", () => {
    const duration = Duration.fromObject({
      months: 2,
      days: 3,
      minutes: 5,
    });
    expect(toHuman(duration)).toBe("2 months 3 days 5 minutes");
  });

  it("should format duration with no units", () => {
    const duration = Duration.fromObject({});
    expect(toHuman(duration)).toBe("0 seconds");
  });

  it("should respect smallestUnit parameter", () => {
    const duration = Duration.fromObject({
      years: 1,
      months: 2,
      days: 3,
      hours: 4,
      minutes: 5,
      seconds: 6,
      milliseconds: 7,
    });
    expect(toHuman(duration, "hours")).toBe("1 year 2 months 3 days 4 hours");
  });

  it("should normalize values", () => {
    const duration = Duration.fromObject({
      months: 14, // This should convert to 1 year 2 months
      days: 3,
    });
    expect(toHuman(duration)).toBe("1 year 2 months 3 days");
  });

  it("should handle zero duration with custom smallest unit", () => {
    const duration = Duration.fromObject({});
    expect(toHuman(duration, "minutes")).toBe("0 minutes");
  });
});
