import { DateTime } from "luxon";
import { AccountData } from "shared/models/store/current";

/**
 * Interface for a value that spans a time period
 *
 * @interface TimeSpanValue
 * @property {DateTime} start - Start date of the time span
 * @property {DateTime} end - End date of the time span
 * @property {number} value - The value applicable during this time span
 */
interface TimeSpanValue {
  start: DateTime;
  end: DateTime;
  value: number;
}

/**
 * Converts an array of account data points into time spans with values
 * Each span represents a period where a particular value was in effect
 *
 * @param {AccountData[]} account - Array of account data entries with dates and values
 * @returns {TimeSpanValue[]} Array of time spans with their corresponding values
 */
export const getValueByDateRange = (account: AccountData[]): TimeSpanValue[] => {
  return account.map((x, index, array) => {
    const next = array[index + 1];
    return {
      start: DateTime.fromISO(x.date),
      end: (next?.date ? DateTime.fromISO(next?.date).startOf("day") : DateTime.fromISO(x.date).plus({ years: 1 }))
        .minus({ days: 1 })
        .endOf("day"),
      value: x.value,
    };
  });
};
