import { DateTime } from "luxon";
import { PaymentPeriod } from "shared/models/payment-periods";
import { AccountData, TimeSeries } from "shared/models/store/current";
import { findSameYear } from "./find-same-year";
import { getPayments } from "./get-payments";
import { getValueByDateRange } from "./get-values-by-date-range";

/**
 * Interface representing a sequence of merit-based compensation details
 *
 * @interface MeritSequence
 * @property {number} year - The year this sequence applies to
 * @property {AccountData[]} pay - Array of pay-related account data
 * @property {number} lastThreeMeritBonusFactor - Sum of last three merit bonus percentages
 * @property {number[]} lastThreeMeritBonuses - Array of last three merit bonus percentages
 * @property {number} meritBonusPct - Current merit bonus percentage
 * @property {number} meritIncreasePct - Merit increase percentage
 * @property {PaymentPeriod[]} payments - Array of payment periods
 * @property {number} equityIncreasePct - Equity increase percentage
 * @property {number} retirementBonusPct - Retirement bonus percentage
 * @property {number} weight - Statistical weight for probability calculations
 */
export interface MeritSequence {
  year: number;
  pay: AccountData[];
  lastThreeMeritBonusFactor: number;
  lastThreeMeritBonuses: number[];
  meritBonusPct: number;
  meritIncreasePct: number;
  payments: PaymentPeriod[];
  equityIncreasePct: number;
  retirementBonusPct: number;
  weight: number;
}

/**
 * Creates an empty merit sequence with default values for a given year
 * Used as a fallback when no merit data exists
 *
 * @param {number} year - The year to create the sequence for
 * @param {TimeSeries} timeSeries - Time series data containing historical merit information
 * @param {AccountData[]} pay - Array of pay data
 * @returns {MeritSequence} A merit sequence with default values
 */
export const getEmptyMeritSequence = (year: number, timeSeries: TimeSeries, pay: AccountData[]) => {
  const meritDetails = findSameYear(year, timeSeries.meritPct);
  const equityIncreasePct = meritDetails?.equityPct ?? 0;
  const meritIncreasePct = meritDetails?.meritIncreasePct ?? 0;
  const meritBonusPct = meritDetails?.meritBonusPct ?? 0;
  const lastThreeMeritBonuses = pay
    .map((x) => findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritPct)?.meritBonusPct ?? 0)
    .slice(-3);

  const lastThreeMeritBonusFactor = lastThreeMeritBonuses.reduce((acc, curr) => acc + curr, 0);
  const payments = getPayments(
    DateTime.fromObject({ day: 1, month: 1, year: year - 1 }),
    DateTime.fromObject({ day: 31, month: 12, year: year }).endOf("day"),
    getValueByDateRange(pay)
  );

  return {
    year,
    pay: pay.slice(),
    lastThreeMeritBonusFactor,
    lastThreeMeritBonuses,
    meritBonusPct,
    meritIncreasePct,
    payments,
    equityIncreasePct,
    retirementBonusPct: 0.15,
    weight: 1,
  } as MeritSequence;
};
