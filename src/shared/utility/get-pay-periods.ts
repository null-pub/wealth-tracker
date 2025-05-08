import { DateTime } from "luxon";

/**
 * Interface representing a payment period
 *
 * @interface PayPeriod
 * @property {DateTime} start - Start date of the pay period
 * @property {DateTime} end - End date of the pay period
 * @property {DateTime} payedOn - Date when the payment is made
 */
interface PayPeriod {
  start: DateTime;
  end: DateTime;
  payedOn: DateTime;
}

/**
 * Generates an array of pay periods based on a given date range
 *
 * @param {DateTime} anyPayday - A reference payday to align the periods with
 * @param {DateTime} start - Start date of the overall range
 * @param {DateTime} end - End date of the overall range
 * @returns {PayPeriod[]} Array of pay periods between start and end dates
 */
export const getPayPeriods = (anyPayday: DateTime, start: DateTime, end: DateTime): PayPeriod[] => {
  const diff = anyPayday.diff(start, ["weeks", "days"]);
  const startPayDay = start.plus({
    days: diff.days,
    weeks: +(diff.weeks % 2 !== 0),
  });

  const numPayDays = end.diff(start, ["weeks", "days"]).weeks / 2;
  const periods = [];
  for (let i = 0; i <= numPayDays; i++) {
    periods.push({
      start: startPayDay.plus({ weeks: i * 2 - 3, day: 3 }),
      end: startPayDay.plus({ weeks: i * 2 - 1 }).endOf("day"),
      payedOn: startPayDay.plus({ weeks: i * 2 }),
    });
  }

  return periods.filter((x) => x.payedOn > start && x.payedOn < end);
};
