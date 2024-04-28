export function uniqueCountSorted<T>(x: T[], selector: (x: T) => number) {
  let uniqueValueCount = 0,
    lastSeenValue;
  for (let i = 0; i < x.length; i++) {
    const value = selector(x[i]);
    if (i === 0 || value !== lastSeenValue) {
      lastSeenValue = value;
      uniqueValueCount++;
    }
  }
  return uniqueValueCount;
}
