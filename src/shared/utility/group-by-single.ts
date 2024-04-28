export const groupBySingle = <T, Tkey extends string | number>(array: T[], selector: (data: T) => Tkey) => {
  const result = {} as Partial<Record<Tkey, T>>;
  for (let i = 0; i < array.length; i++) {
    result[selector(array[i])] ??= array[i];
  }
  return result;
};
