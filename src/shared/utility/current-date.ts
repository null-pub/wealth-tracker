import { DateTime } from "luxon";

/**
 * Gets the current local date and time
 * Used as a centralized way to access the current date/time throughout the application
 *
 * @returns {DateTime} The current local date and time
 * @example
 * const now = getLocalDateTime();
 * console.log(now.toISO()); // e.g., "2025-05-07T10:30:00.000-04:00"
 */
export const getLocalDateTime = () => {
  return DateTime.local();
};

/**
 * React hook that returns the current local date and time
 *
 * @returns {DateTime} The current local date and time as a Luxon DateTime object
 */
export const useLocalDateTime = () => {
  const date = getLocalDateTime();
  return date;
};
