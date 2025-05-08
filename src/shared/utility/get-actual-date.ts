import { DateTime } from "luxon";
import { AccountData } from "shared/models/store/current";
import { findSameYear } from "./find-same-year";

/**
 * Gets the actual date for an account entry in a specific year
 * Used to find historical dates for events like bonuses or payments
 *
 * @param {number} year - The year to get the date for
 * @param {AccountData[] | undefined} data - Array of account data entries
 * @returns {DateTime | undefined} The actual date from the matching year's entry, or undefined if not found
 * @example
 * const bonusDates = [
 *   { date: '2024-06-15', value: 5000 },
 *   { date: '2025-06-15', value: 6000 }
 * ];
 * getActualDate(2025, bonusDates); // returns DateTime for 2025-06-15
 */
export const getActualDate = (year: number | undefined, data: AccountData[]) => {
  if (!year) {
    return undefined;
  }

  const entry = findSameYear(year, data);
  return entry ? DateTime.fromISO(entry.date) : undefined;
};
