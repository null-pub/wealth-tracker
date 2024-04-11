export function groupBy<T, T2 extends string | number | symbol>(array: T[], selector: (x: T) => T2): Record<T2, T[]> {
  return array.reduce((acc: Record<T2, T[]>, curr: T) => {
    const key = selector(curr);
    acc[key] ??= [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<T2, T[]>);
}

export function groupBySingle<T, T2 extends string | number | symbol>(
  array: T[],
  selector: (x: T) => T2
): Record<T2, T> {
  return array.reduce((acc: Record<T2, T>, curr: T) => {
    const key = selector(curr);
    acc[key] ??= curr;

    return acc;
  }, {} as Record<T2, T>);
}
