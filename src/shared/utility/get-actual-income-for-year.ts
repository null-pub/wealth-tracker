import { ProjectedIncome } from "shared/models/store/current";
import { findSameYear } from "./find-same-year";

/**
 * Retrieves actual income data for a specific year from projected income data
 *
 * @param {number} year - The year to get actual income for
 * @param {ProjectedIncome} projectedIncome - Historical and projected income data
 * @returns {Object} Object containing actual bonus amounts for the year
 * @property {number | undefined} meritBonus - Actual merit bonus amount if paid
 * @property {number | undefined} companyBonus - Actual company bonus amount if paid
 * @property {number | undefined} retirementBonus - Actual retirement bonus amount if paid
 * @example
 * const income = getActualIncomeForYear(2025, projectedIncomeData);
 * if (income.meritBonus) {
 *   console.log(`Merit bonus for 2025: ${income.meritBonus}`);
 * }
 */
export const getActualIncomeForYear = (year: number, projectedIncome: ProjectedIncome) => {
  return {
    meritBonus: findSameYear(year, projectedIncome.timeSeries.meritBonus)?.value,
    companyBonus: findSameYear(year, projectedIncome.timeSeries.companyBonus)?.value,
    retirementBonus: findSameYear(year, projectedIncome.timeSeries.retirementBonus)?.value,
  };
};
