const areSetsEqual = <T>(a: Set<T>, b: Set<T>) => [...a].every((value) => b.has(value)) && [...b].every((value) => a.has(value));

export const collapseClusters = <T>(data: T[][], selector: (data: T) => number) => {
  const sets = data.map((x) => new Set(x.map((y) => selector(y))));
  const result: T[][] = [];
  for (let i = 0; i < sets.length; i++) {
    const curr = data[i].slice();
    for (let j = i + 1; j < sets.length; j++) {
      if (areSetsEqual(sets[i], sets[j])) {
        curr.push(...data[j]);
        sets.splice(j, 1);
        data.splice(j, 1);
      }
    }
    result.push(curr);
  }
  return result;
};
