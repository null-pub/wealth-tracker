import { Scenario } from "shared/models/scenario";
import { ProjectedIncome } from "shared/models/store/current";
import { getActualIncomeForYear } from "shared/utility/get-actual-income-for-year";
import { getEligibleIncomeDateRanges } from "shared/utility/get-eligible-income-date-ranges";
import { applyBonuses, buildBaseScenarios, getScenarioDates } from "shared/utility/scenario-generation";

/**
 * Generates financial scenarios for a specific year
 * Combines actual income data with projections to create possible future scenarios
 *
 * @param {number} year - The year to generate scenarios for
 * @param {ProjectedIncome} projectedIncome - Historical and projected income data
 * @returns {Scenario[]} Array of possible financial scenarios for the year
 */
export const getScenarios = (year: number, projectedIncome: ProjectedIncome): Scenario[] => {
  const dates = getScenarioDates(year, projectedIncome);
  const dateRanges = getEligibleIncomeDateRanges(year);
  const paid = getActualIncomeForYear(year, projectedIncome);

  // Build base scenarios with merit increases & company bonuses
  const baseScenarios = buildBaseScenarios(year, projectedIncome, dates);

  // Apply all bonuses and finalize scenarios
  return applyBonuses(baseScenarios, dates, dateRanges, paid);
};
