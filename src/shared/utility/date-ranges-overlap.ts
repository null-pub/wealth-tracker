import { DateTime } from "luxon";

interface DateRange {
  start: DateTime;
  end: DateTime;
}

/**
 * Checks if two date ranges overlap
 * Two ranges overlap if one range's start date is before or equal to the other's end date,
 * and one range's end date is after or equal to the other's start date
 *
 * @param {DateRange} a - First date range
 * @param {DateRange} b - Second date range
 * @returns {boolean} True if the ranges overlap, false otherwise
 * @example
 * const range1 = { start: DateTime.fromISO('2025-01-01'), end: DateTime.fromISO('2025-06-30') };
 * const range2 = { start: DateTime.fromISO('2025-06-01'), end: DateTime.fromISO('2025-12-31') };
 * DateRangesOverlap(range1, range2); // returns true
 */
export const DateRangesOverlap = (a: DateRange, b: DateRange) => {
  return a.start <= b.end && a.end >= b.start;
};
