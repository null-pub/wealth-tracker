import { DateTime } from "luxon";
import { getLocalDateTime } from "./current-date";

/**
 * Checks if a given date is in the future relative to the current local date
 *
 * @param {DateTime} date - The date to check
 * @returns {boolean} True if the date is in the future, false otherwise
 * @example
 * const futureDate = DateTime.now().plus({ days: 1 });
 * isFuture(futureDate); // returns true
 *
 * const pastDate = DateTime.now().minus({ days: 1 });
 * isFuture(pastDate); // returns false
 */
export const isFuture = (date: DateTime) => {
  return getLocalDateTime() < date;
};
