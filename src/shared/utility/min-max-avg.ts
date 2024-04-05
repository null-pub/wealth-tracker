export interface Outcome {
  min: number;
  max: number;
  avg: number;
  actual?: number;
}

export interface BonusOutcomes {
  percent: Outcome;
  cash: Outcome;
}

export const minMaxAvg = (values: number[]): Outcome => {
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }
  return values.reduce(
    (acc, curr, index, arr) => {
      const { min, max, avg } = acc;
      return {
        min: Math.min(curr, min),
        max: Math.max(curr, max),
        avg: index === arr.length - 1 ? (avg + curr) / arr.length : avg + curr,
      };
    },
    { min: Infinity, max: 0, avg: 0 },
  );
};

export const outcomeFromSingle = (value: number): Outcome => {
  return { min: value, max: value, avg: value, actual: value };
};

export const actualizedOutcome = (outcome: Outcome): Outcome =>
  outcome.actual ? outcomeFromSingle(outcome.actual) : outcome;

export const scaleOutcome = (outcome: Outcome, value: number): Outcome => {
  return {
    min: outcome.min * value,
    max: outcome.max * value,
    avg: outcome.avg * value,
    actual: outcome.actual ? outcome.actual * value : undefined,
  };
};
export const AddConstantOutcome = (outcome: Outcome, value: number): Outcome => {
  return {
    min: outcome.min + value,
    max: outcome.max + value,
    avg: outcome.avg + value,
    actual: outcome.actual ? outcome.actual + value : undefined,
  };
};

export const MultiplyOutcome = (outcomeA: Outcome, outcomeB: Outcome): Outcome => {
  return {
    min: outcomeA.min * outcomeB.min,
    max: outcomeA.max * outcomeB.max,
    avg: outcomeA.avg * outcomeB.avg,
    actual: outcomeA.actual != undefined && outcomeB.actual != undefined ? outcomeA.actual * outcomeB.avg : undefined,
  };
};

export const AddOutcome = (...outcomes: Outcome[]): Outcome => {
  const everyActualDefined = outcomes.every((x) => x.actual != undefined);
  return outcomes.reduce(
    (acc, curr) => {
      return {
        min: acc.min + curr.min,
        avg: acc.avg + curr.avg,
        max: acc.max + curr.max,
        actual: everyActualDefined ? (acc.actual ?? 0) + (curr.actual ?? 0) : undefined,
      };
    },
    { min: 0, max: 0, avg: 0, actual: undefined },
  );
};
