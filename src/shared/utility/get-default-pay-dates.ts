import { DateTime } from "luxon";

/**
 * Gets the default payment dates for various types of compensation
 * Provides standard dates for merit increases, bonuses, and retirement payments
 *
 * @param {number} [year] - Optional year to set for the dates
 * @returns {Object} Object containing default dates for different payment types
 * @property {DateTime} meritIncrease - Default date for merit pay increases (April 1)
 * @property {DateTime} meritBonus - Default date for merit bonuses (April 15)
 * @property {DateTime} companyBonus - Default date for company-wide bonuses (June 15)
 * @property {DateTime} retirementBonus - Default date for retirement bonuses (July 15)
 */
export const getDefaultPayDates = (year?: number) => {
  return {
    meritIncrease: DateTime.fromObject({ month: 4, day: 1, year }),
    meritBonus: DateTime.fromObject({ month: 4, day: 15, year }),
    companyBonus: DateTime.fromObject({ month: 6, day: 15, year }),
    retirementBonus: DateTime.fromObject({ month: 7, day: 15, year }),
  };
};
