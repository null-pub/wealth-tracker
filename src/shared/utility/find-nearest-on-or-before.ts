import { DateTime } from "luxon";
import { AccountData } from "shared/models/store/current";

/**
 * Finds the nearest account data entry on or before a given date
 *
 * @template T
 * @param {DateTime} searchDate - The date to search for
 * @param {T[]} data - Array of data entries to search through
 * @param {(x: T) => string} [dateSelector] - Optional function to extract date from entry
 * @returns {T | undefined} The nearest entry on or before the search date, or undefined if none found
 */
export const findNearestOnOrBefore = <T extends AccountData>(
  searchDate: DateTime,
  data: T[],
  dateSelector: (x: T) => string = (x) => x.date
): T | undefined => {
  const idx = findNearestIdxOnOrBefore(searchDate, data, dateSelector);
  return data[idx];
};

/**
 * Finds the index of the nearest entry on or before a given date
 *
 * @template T
 * @param {DateTime} searchDate - The date to search for
 * @param {T[]} data - Array of data entries to search through
 * @param {(x: T) => string} [dateSelector] - Optional function to extract date from entry
 * @returns {number} The index of the nearest entry on or before the search date, or -1 if none found
 */
export const findNearestIdxOnOrBefore = <T extends AccountData>(
  searchDate: DateTime,
  data: T[],
  dateSelector: (x: T) => string = (x) => x.date
): number => {
  if (data.length === 0) {
    return -1;
  }

  let low = 0;
  let high = data.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midDate = DateTime.fromISO(dateSelector(data[mid]));

    if (midDate.equals(searchDate)) {
      return mid;
    } else if (midDate < searchDate) {
      if (mid === data.length - 1 || DateTime.fromISO(dateSelector(data[mid + 1])) > searchDate) {
        return mid;
      }
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return high;
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
  if (items.length === 0) {
    return -1;
  }
  let nearest = -1;
  for (let i = 0; i < items.length; i++) {
    const date = selector(items[i]);
    if (date > target) {
      break;
    }
    nearest = i;
  }
  return nearest;
};
