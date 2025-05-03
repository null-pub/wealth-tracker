import { ChunkByEquality } from "shared/utility/chunk-by-equality";
import { describe, expect, it } from "vitest";

describe("ChunkByEquality", () => {
  it("should chunk array when selected value changes", () => {
    const data = [
      { value: 1, other: "a" },
      { value: 1, other: "b" },
      { value: 2, other: "c" },
      { value: 2, other: "d" },
      { value: 1, other: "e" },
    ];

    const result = ChunkByEquality(data, (x) => x.value);

    expect(result).toEqual([
      [
        { value: 1, other: "a" },
        { value: 1, other: "b" },
      ],
      [
        { value: 2, other: "c" },
        { value: 2, other: "d" },
      ],
      [{ value: 1, other: "e" }],
    ]);
  });

  it("should handle empty array", () => {
    const result = ChunkByEquality([], (x: number) => x);
    expect(result).toEqual([]);
  });

  it("should handle array with single item", () => {
    const data = [{ value: 1 }];
    const result = ChunkByEquality(data, (x) => x.value);
    expect(result).toEqual([[{ value: 1 }]]);
  });

  it("should handle array with all different values", () => {
    const data = [
      { value: 1, other: "a" },
      { value: 2, other: "b" },
      { value: 3, other: "c" },
    ];
    const result = ChunkByEquality(data, (x) => x.value);
    expect(result).toEqual([[{ value: 1, other: "a" }], [{ value: 2, other: "b" }], [{ value: 3, other: "c" }]]);
  });

  it("should handle array with all same values", () => {
    const data = [
      { value: 1, other: "a" },
      { value: 1, other: "b" },
      { value: 1, other: "c" },
    ];
    const result = ChunkByEquality(data, (x) => x.value);
    expect(result).toEqual([
      [
        { value: 1, other: "a" },
        { value: 1, other: "b" },
        { value: 1, other: "c" },
      ],
    ]);
  });

  it("should chunk by arbitrary selected values", () => {
    const data = [
      { value: 1, group: "A" },
      { value: 2, group: "A" },
      { value: 3, group: "B" },
      { value: 4, group: "B" },
    ];
    const result = ChunkByEquality(data, (x) => x.group);
    expect(result).toEqual([
      [
        { value: 1, group: "A" },
        { value: 2, group: "A" },
      ],
      [
        { value: 3, group: "B" },
        { value: 4, group: "B" },
      ],
    ]);
  });
});
