import { renderHook } from "@testing-library/react";
import { useStoreDataError } from "shared/hooks/use-store-data-error";
import { afterEach, describe, expect, test } from "vitest";

describe("useStoreDataError", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("should return hadError false when no invalid data exists", () => {
    const { result } = renderHook(() => useStoreDataError());
    expect(result.current.hadError).toBe(false);
    expect(result.current.invalidData).toBeUndefined();
    expect(result.current.parseError).toBeUndefined();
  });

  test("should handle invalid store data", () => {
    const invalidData = { version: 5, invalidField: "test" };
    localStorage.setItem("store-invalid", JSON.stringify(invalidData));

    const { result } = renderHook(() => useStoreDataError());
    expect(result.current.hadError).toBe(true);
    expect(result.current.invalidData).toEqual(invalidData);
    expect(result.current.parseError).toBeDefined();
  });

  test("should be able to reset error state", () => {
    localStorage.setItem("store-invalid", JSON.stringify({ invalid: "data" }));

    const { result } = renderHook(() => useStoreDataError());
    expect(result.current.hadError).toBe(true);

    result.current.resetError?.();
    expect(localStorage.getItem("store-invalid")).toBeNull();
  });
});
