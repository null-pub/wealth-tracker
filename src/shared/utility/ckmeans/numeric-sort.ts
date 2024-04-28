export function numericSort<T>(x: T[], selector: (data: T) => number) {
  return x.toSorted(function (a, b) {
    return selector(a) - selector(b);
  });
}
