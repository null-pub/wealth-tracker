import { DateTime } from "luxon";

export interface PayPeriod {
  start: DateTime;
  end: DateTime;
  payedOn: DateTime;
}

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
