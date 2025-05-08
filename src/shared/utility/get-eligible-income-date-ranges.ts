import { DateTime } from "luxon";

/**
 * Gets the date ranges used for calculating eligible income for different bonus types
 * Defines ranges for the base salary period and various bonus calculation periods
 *
 * @param {number} year - The year to get date ranges for
 * @returns {Object} Object containing date ranges for different income types
 * @property {Object} base - Date range for base salary calculations
 * @property {DateTime} base.start - Start of the base salary period (Jan 1)
 * @property {DateTime} base.end - End of the base salary period (Dec 31)
 * @property {Object} meritBonus - Date range for merit bonus calculations
 * @property {DateTime} meritBonus.start - Start of merit bonus period (Jan 1)
 * @property {DateTime} meritBonus.end - End of merit bonus period (Dec 31)
 * @property {Object} companyBonus - Date range for company bonus calculations
 * @property {DateTime} companyBonus.start - Start of company bonus period (Jul 1 previous year)
 * @property {DateTime} companyBonus.end - End of company bonus period (Jun 30 current year)
 * @property {Object} retirementBonus - Date range for retirement bonus calculations
 * @property {DateTime} retirementBonus.start - Start of retirement bonus period (Jan 1)
 * @property {DateTime} retirementBonus.end - End of retirement bonus period (Dec 31)
 */
export const getEligibleIncomeDateRanges = (year: number) => ({
  base: {
    start: DateTime.fromObject({ month: 1, day: 1, year }),
    end: DateTime.fromObject({ month: 12, day: 31, year }).endOf("day"),
  },
  meritBonus: {
    start: DateTime.fromObject({ month: 1, day: 1, year: year - 1 }),
    end: DateTime.fromObject({ month: 12, day: 31, year: year - 1 }).endOf("day"),
  },
  companyBonus: {
    start: DateTime.fromObject({ day: 1, month: 4, year: year - 1 }),
    end: DateTime.fromObject({ day: 31, month: 3, year }).endOf("day"),
  },
  retirementBonus: {
    start: DateTime.fromObject({ day: 1, month: 7, year: year - 1 }),
    end: DateTime.fromObject({ day: 30, month: 6, year }).endOf("day"),
  },
});
