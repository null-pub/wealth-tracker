import { Duration, DurationUnit } from "luxon";

/**
 * Converts a Luxon Duration object to a human-readable string format
 *
 * @param {Duration} dur - The Luxon Duration object to convert
 * @param {DurationUnit} smallestUnit - The smallest unit of time to include in the output (default: 'seconds')
 * @returns {string} A formatted human-readable string representation of the duration
 *
 * @example
 * // Returns "2 years 3 months 5 days"
 * toHuman(Duration.fromObject({ years: 2, months: 3, days: 5, hours: 0 }), "days")
 */
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
