import { useStore } from "@tanstack/react-store";
import { store } from "shared/store";
import { getActualDate } from "shared/utility/get-actual-date";
import { getDefaultPayDates } from "shared/utility/get-default-pay-dates";
import { getEligibleIncomeDateRanges } from "shared/utility/get-eligible-income-date-ranges";

/**
 * React hook that provides important financial dates for a specific year
 *
 * @param {number} [year] - The year to get dates for (optional)
 * @returns {Object} Object containing dates for merit increase, merit bonus, company bonus, and retirement bonus
 */
export const useDates = (year?: number) => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const meritBonusDate = getActualDate(year, timeSeries.meritBonus);
  const companyBonusDate = getActualDate(year, timeSeries.companyBonus);
  const retirementBonusDate = getActualDate(year, timeSeries.retirementBonus);
  const defaultDates = getDefaultPayDates(year);

  return {
    meritIncrease: defaultDates.meritIncrease,
    meritBonus: meritBonusDate ?? defaultDates.meritBonus,
    companyBonus: companyBonusDate ?? defaultDates.companyBonus,
    retirementBonus: retirementBonusDate ?? defaultDates.retirementBonus,
  };
};

/**
 * React hook that provides eligible income date ranges for a specific year
 *
 * @param {number} year - The year to get date ranges for
 * @returns {Object} Object containing eligible income date ranges for different types of income
 */
export const useDateRanges = (year: number) => {
  return getEligibleIncomeDateRanges(year);
};
