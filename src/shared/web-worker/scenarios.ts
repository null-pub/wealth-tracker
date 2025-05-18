import { Scenario } from "shared/models/scenario";
import { ProjectedIncome } from "shared/models/store/current";
import { findSameYear } from "shared/utility/find-same-year";
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
  const { timeSeries } = projectedIncome;

  // Get all relevant dates and date ranges
  const dates = getScenarioDates(year, projectedIncome);
  const dateRanges = getEligibleIncomeDateRanges(year);

  // Get historical pay data

  // Get actual paid bonuses for the year
  const paid = {
    meritBonus: findSameYear(year, timeSeries.meritBonus)?.value,
    companyBonus: findSameYear(year, timeSeries.companyBonus)?.value,
    retirementBonus: findSameYear(year, timeSeries.retirementBonus)?.value,
  };

  // Get company bonus factors that will be applied to scenarios

  // Build base scenarios with merit increases & company bonuses
  const baseScenarios = buildBaseScenarios(year, projectedIncome.timeSeries, dates);

  // Apply all bonuses and finalize scenarios
  return applyBonuses(baseScenarios, dates, dateRanges, paid);
};
