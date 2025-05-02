import { DateTime } from "luxon";
import { Scenario } from "shared/models/scenario";
import { ProjectedIncome } from "shared/models/store/current";
import { findSameYear } from "shared/utility/find-same-year";
import { getEligibleIncomeDateRanges } from "shared/utility/get-eligible-income-date-ranges";
import { groupBySingle } from "shared/utility/group-by-single";
import { applyBonuses, buildBaseScenarios, getCompanyBonusFactors, getScenarioDates } from "shared/utility/scenario-generation";

export const getScenarios = (year: number, projectedIncome: ProjectedIncome): Scenario[] => {
  const { timeSeries } = projectedIncome;

  // Get all relevant dates and date ranges
  const dates = getScenarioDates(year, projectedIncome);
  const dateRanges = getEligibleIncomeDateRanges(year);

  // Get historical pay data
  const pay = timeSeries.paycheck.filter((x) => {
    const date = DateTime.fromISO(x.date);
    return date.year > year - 3 && date.year <= year;
  });

  const mostRecentPay = pay.at(-1) ?? timeSeries.paycheck.at(-1);
  if (!mostRecentPay) {
    return [];
  }

  // Get actual paid bonuses for the year
  const paid = {
    meritBonus: findSameYear(year, timeSeries.meritBonus)?.value,
    companyBonus: findSameYear(year, timeSeries.companyBonus)?.value,
    retirementBonus: findSameYear(year, timeSeries.retirementBonus)?.value,
  };

  // Build equity lookup for future pay calculations
  const equityLookup = groupBySingle(timeSeries.equityPct, (x) => DateTime.fromISO(x.date).year);

  // Get company bonus factors that will be applied to scenarios
  const companyBonusFactors = getCompanyBonusFactors(year, timeSeries);

  // Build base scenarios with merit increases
  const baseScenarios = buildBaseScenarios(year, projectedIncome, pay, mostRecentPay, dates, equityLookup);

  // Apply all bonuses and finalize scenarios
  return applyBonuses(baseScenarios, companyBonusFactors, dates, dateRanges, paid);
};
