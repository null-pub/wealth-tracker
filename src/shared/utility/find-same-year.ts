import { DateTime } from "luxon";

/**
 * Finds an account data entry from a specific year
 * Used to find historical data points that match a target year
 *
 * @template T - Type extending AccountData
 * @param {number} year - The year to search for
 * @param {T[] | undefined} data - Array of account data entries to search through
 * @returns {T | undefined} The matching entry for the year, or undefined if none found
 * @example
 * const data = [
 *   { date: '2024-01-01', value: 100 },
 *   { date: '2025-01-01', value: 200 }
 * ];
 * findSameYear(2025, data); // returns { date: '2025-01-01', value: 200 }
 */
export function findSameYear<T extends { date: string }>(year: number, data: T[]): T | undefined;
export function findSameYear<T extends { date: string }>(date: DateTime, data: T[]): T | undefined;
export function findSameYear<T extends { date: string }>(date: DateTime | number, data: T[]): T | undefined {
  const year = typeof date === "number" ? date : date.year;
  return data.find((x) => {
    return DateTime.fromISO(x.date).year === year;
  });
}
