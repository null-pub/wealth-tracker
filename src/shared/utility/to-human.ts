import { Duration, DurationUnit } from "luxon";

export function toHuman(dur: Duration, smallestUnit: DurationUnit = "seconds"): string {
  const units = ["years", "months", "days", "hours", "minutes", "seconds", "milliseconds"] as DurationUnit[];
  const smallestIdx = units.indexOf(smallestUnit);
  const entries = Object.entries(
    dur
      .shiftTo(...units)
      .normalize()
      .toObject()
  ).filter(([, amount], idx) => amount > 0 && idx <= smallestIdx);
  const dur2 = Duration.fromObject(entries.length === 0 ? { [smallestUnit]: 0 } : Object.fromEntries(entries));
  return dur2.toHuman().replaceAll(",", "");
}
