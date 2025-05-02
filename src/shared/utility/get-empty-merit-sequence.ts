import { DateTime } from "luxon";
import { PaymentPeriod } from "shared/models/payment-periods";
import { AccountData, TimeSeries } from "shared/models/store/current";
import { findSameYear } from "./find-same-year";
import { getPayments } from "./get-payments";
import { getValueByDateRange } from "./get-values-by-date-range";

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

export const getEmptyMeritSequence = (year: number, timeSeries: TimeSeries, pay: AccountData[]) => {
  const equityIncreasePct = findSameYear(year, timeSeries.equityPct)?.value ?? 0;
  const meritIncreasePct = findSameYear(year, timeSeries.meritIncreasePct)?.value ?? 0;
  const meritBonusPct = findSameYear(year, timeSeries.meritBonusPct)?.value ?? 0;
  const meritBonuses = pay.map((x) => findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct)?.value ?? 0);

  const lastThreeMeritBonuses = meritBonuses.slice(-3);
  const lastThreeMeritBonusFactor = meritBonuses.slice(-3).reduce((acc, curr) => acc + curr, 0);
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
