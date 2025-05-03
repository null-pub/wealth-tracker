import { getProbablityColor } from "shared/utility/get-probablity-color";
import { describe, expect, it } from "vitest";

describe("getProbablityColor", () => {
  it("should return 'inherit' when probability is undefined", () => {
    expect(getProbablityColor(undefined)).toBe("inherit");
  });

  it("should return 'inherit' when probability is 0", () => {
    expect(getProbablityColor(0)).toBe("inherit");
  });

  it("should return 'green' when probability >= 0.5", () => {
    expect(getProbablityColor(0.5)).toBe("green");
    expect(getProbablityColor(0.75)).toBe("green");
    expect(getProbablityColor(1)).toBe("green");
  });

  it("should return 'orange' when probability >= 0.25 and < 0.5", () => {
    expect(getProbablityColor(0.25)).toBe("orange");
    expect(getProbablityColor(0.35)).toBe("orange");
    expect(getProbablityColor(0.49)).toBe("orange");
  });

  it("should return 'rgb(244, 67, 54)' when probability < 0.25", () => {
    expect(getProbablityColor(0.1)).toBe("rgb(244, 67, 54)");
    expect(getProbablityColor(0.24)).toBe("rgb(244, 67, 54)");
  });
});
