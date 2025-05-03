import { DateTime } from "luxon";
import "shared/utility/luxon-extensions";
import { describe, expect, it } from "vitest";

describe("luxon-extensions", () => {
  describe("toValid", () => {
    it("should return the same date when valid", () => {
      const validDate = DateTime.fromISO("2025-01-01");
      expect(validDate.toValid()).toBe(validDate);
    });

    it("should throw error when date is invalid", () => {
      const invalidDate = DateTime.fromISO("invalid");
      expect(() => invalidDate.toValid()).toThrow("Invalid date: unparsable");
    });
  });
});
