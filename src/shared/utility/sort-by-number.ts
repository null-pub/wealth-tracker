export function sortByNumbers<T>(...criteria: Array<["asc" | "desc", (item: T) => number]>): (a: T, b: T) => number {
  return (a, b) => {
    for (const [direction, selector] of criteria) {
      const factor = direction === "asc" ? 1 : -1;
      const diff = (selector(a) - selector(b)) * factor;
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  };
}
