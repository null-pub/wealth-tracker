import { DateTime } from "luxon";

export interface PayPeriod {
  start: DateTime;
  end: DateTime;
  payedOn: DateTime;
}

export const getPayPeriods = (anyPayday: DateTime, start: DateTime, end: DateTime): PayPeriod[] => {
  const diff = -1 * Math.abs(start.diff(anyPayday, ["weeks", "days"]).days);
  const daysOffset = +(anyPayday > start);
  const startPayDay = start.plus({
    day: diff + daysOffset,
  });

  const numPayDays = end.diff(start, ["weeks", "days"]).weeks / 2;
  const periods = [];
  for (let i = 1; i <= numPayDays; i++) {
    periods.push({
      start: startPayDay.plus({ weeks: i * 2 - 3, day: 3 }),
      end: startPayDay.plus({ weeks: i * 2 - 1 }).endOf("day"),
      payedOn: startPayDay.plus({ weeks: i * 2 }),
    });
  }
  return periods;
};
