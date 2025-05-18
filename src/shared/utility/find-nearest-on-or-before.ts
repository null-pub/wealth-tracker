import { DateTime } from "luxon";

/**
 * Finds the nearest account data entry on or before a given date
 *
 * @template T
 * @param {DateTime} searchDate - The date to search for
 * @param {T[]} data - Array of data entries to search through
 * @param {(x: T) => string} [dateSelector] - Optional function to extract date from entry
 * @returns {T | undefined} The nearest entry on or before the search date, or undefined if none found
 */
export const findNearestOnOrBefore = <T>(searchDate: DateTime, data: T[], dateSelector: (x: T) => string): T | undefined => {
  const idx = findNearestIdxOnOrBefore(searchDate, data, (x) => DateTime.fromISO(dateSelector(x)));
  return data[idx];
};

/**
 * Finds the index of the item in an array that has the nearest date on or before a target date
 *
 * @template T - Type of array elements
 * @param {DateTime} target - Target date to find nearest match for
 * @param {T[]} items - Array of items to search through
 * @param {(x: T) => DateTime} selector - Function that extracts a DateTime from an item
 * @returns {number} Index of the nearest item on or before the target date, or -1 if no match
 * @example
 * const items = [{ date: DateTime.fromISO('2025-01-01') }, { date: DateTime.fromISO('2025-06-01') }];
 * findNearestIdxOnOrBefore(DateTime.fromISO('2025-03-15'), items, x => x.date); // returns 0
 */
export const findNearestIdxOnOrBefore = <T>(target: DateTime, items: T[], selector: (x: T) => DateTime) => {
  return items.findLastIndex((x) => selector(x) <= target);
};
