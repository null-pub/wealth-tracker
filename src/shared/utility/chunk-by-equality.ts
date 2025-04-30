/**
 * @description: chunk an array when the selected value changes
 * @param arr : an array of T.
 * @param select : select a property of T to chunk by.
 * @returns : T[][];
 */
export const ChunkByEquality = <T>(arr: T[], select: (data: T) => unknown) => {
  return arr.reduceRight((acc, curr) => {
    if (acc.length > 0 && select(acc[0]?.[0]) === select(curr)) {
      acc[0].unshift(curr);
    } else {
      acc.unshift([curr]);
    }

    return acc;
  }, [] as T[][]);
};
