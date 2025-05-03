import { DateTime } from "luxon";
import { getLocalDateTime, useLocalDateTime } from "shared/utility/current-date";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("current-date", () => {
  const mockDate = DateTime.fromISO("2025-05-03T12:00:00.000");

  beforeEach(() => {
    vi.spyOn(DateTime, "local").mockImplementation(() => mockDate.toValid());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getLocalDateTime should return current local DateTime", () => {
    const result = getLocalDateTime();
    expect(result.toISO()).toBe(mockDate.toISO());
  });

  it("useLocalDateTime should return current local DateTime", () => {
    const result = useLocalDateTime();
    expect(result.toISO()).toBe(mockDate.toISO());
  });
});
