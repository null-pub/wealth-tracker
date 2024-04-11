import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useDates, useDateRanges } from "shared/hooks/use-dates";
import { valueByDateRange } from "shared/hooks/use-projected-pay";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import { PaymentPeriod, getPayments } from "shared/utility/get-payments";
import { useMeritSequence } from "./use-merit-sequence";
import { AccountData } from "shared/models/account-data";

const incomeByRange = (range: { start: DateTime; end: DateTime }, pay: PaymentPeriod[]) => {
  return pay
    .filter((x) => x.payedOn >= range.start && x.payedOn <= range.end)
    .reduce((acc, curr) => acc + curr.value, 0);
};

export interface Scenario {
  totalPay: number;
  basePay: number;
  meritBonus: number;
  companyBonus: number;
  retirementBonus: number;
  companyBonusFactor: number;
  companyBonusPct: number;
  pay: AccountData[];
  lastThreeMeritBonus: number;
  meritBonusPct: number;
  meritIncreasePct: number;
  payments: PaymentPeriod[];
  equityIncreasePct: number;
  retirementBonusPct: number;
}

export const useScenarios = (year: number): Scenario[] => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const meritSequence = useMeritSequence(year);
  const dates = useDates(year);
  const dateRanges = useDateRanges(year);

  const pay = useMemo(() => {
    return timeSeries.paycheck.filter((x) => DateTime.fromISO(x.date).year > year - 3);
  }, [timeSeries.paycheck, year]);

  const emptyMeritSequence = useMemo(() => {
    const equityIncreasePct = findSameYear(year, timeSeries.equityPct)?.value ?? 0;
    const meritIncreasePct = findSameYear(year, timeSeries.meritIncreasePct)?.value ?? 0;
    const meritBonusPct = findSameYear(year, timeSeries.meritBonusPct)?.value ?? 0;
    const meritBonuses = pay.map(
      (x) => findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct)?.value ?? 0
    );

    const lastThreeMeritBonus = meritBonuses.slice(-3).reduce((acc, curr) => acc + curr, 0);
    const payments = getPayments(
      DateTime.fromObject({ day: 1, month: 1, year: year - 1 }),
      DateTime.fromObject({ day: 31, month: 12, year: year }).endOf("day"),
      valueByDateRange(pay)
    );

    return [
      {
        pay: pay.slice(),
        lastThreeMeritBonus,
        meritBonusPct,
        meritIncreasePct,
        payments,
        equityIncreasePct,
        retirementBonusPct: 0.15,
      },
    ];
  }, [pay, timeSeries.equityPct, timeSeries.meritBonusPct, timeSeries.meritIncreasePct, year]);

  return useMemo(() => {
    const mostRecentPay = pay.at(-1) ?? timeSeries.paycheck.at(-1);
    if (!mostRecentPay) {
      return [];
    }

    const equityIncreasePct = findSameYear(year, timeSeries.equityPct)?.value ?? 0;
    const companyBonusFactor = findSameYear(year, timeSeries.companyBonusPct);
    const uniqueCompanyBonusPcts = companyBonusFactor
      ? [companyBonusFactor.value]
      : timeSeries.companyBonusPct.map((x) => x.value);

    const basePayAndMeritScenarios =
      meritSequence.length === 0
        ? emptyMeritSequence
        : meritSequence.map((merits) => {
            const next = pay.slice();
            const initial = next.length;

            for (let i = initial; i < merits.length + initial; i++) {
              const prior = next[i - 1] ?? mostRecentPay;
              const date = DateTime.fromISO(prior.date ?? mostRecentPay.date)
                .plus({ years: 1 })
                .set({ month: dates.meritIncrease.month, day: dates.meritIncrease.day });
              const equity = findSameYear(date.year, timeSeries.equityPct)?.value ?? 0;
              next.push({
                date: date.toISO()!,
                value: prior.value * (1 + merits[i - initial].meritIncreasePct + equity),
                id: "",
              });
            }

            const actualMeritBonusPcts = pay.map(
              (x) => findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct)?.value ?? 0
            );
            const fakeMerit = merits.map((x) => x.meritBonusPct);
            const lastThreeMeritBonus = actualMeritBonusPcts
              .concat(fakeMerit)
              .slice(-3)
              .reduce((acc, curr) => acc + curr, 0);

            const lastMerit = merits.at(-1)!;
            const payments = getPayments(
              DateTime.fromObject({ day: 1, month: 1, year: year - 1 }),
              DateTime.fromObject({ day: 31, month: 12, year: year }).endOf("day"),
              valueByDateRange(next)
            );

            return {
              pay: next,
              lastThreeMeritBonus,
              meritBonusPct: lastMerit.meritBonusPct,
              meritIncreasePct: lastMerit.meritIncreasePct,
              payments,
              equityIncreasePct,
              retirementBonusPct: 0.15,
            };
          });

    const withCompanyBonus = uniqueCompanyBonusPcts.flatMap((x) => {
      return basePayAndMeritScenarios.map((y) => {
        return { ...y, companyBonusFactor: x, companyBonusPct: y.lastThreeMeritBonus * x };
      });
    });

    const totals = withCompanyBonus.map((x) => {
      const basePay = Math.round(incomeByRange(dateRanges.base, x.payments));
      const meritBonus = Math.round(incomeByRange(dateRanges.meritBonus, x.payments) * x.meritBonusPct);
      const companyBonus = Math.round(incomeByRange(dateRanges.companyBonus, x.payments) * x.companyBonusPct);
      const retirementBonus = Math.round(
        (meritBonus + companyBonus + incomeByRange(dateRanges.retirementBonus, x.payments)) * 0.15
      );
      const totalPay = Math.round(
        [basePay, meritBonus, companyBonus, retirementBonus].reduce((acc, curr) => acc + curr, 0)
      );

      return { totalPay, basePay, meritBonus, companyBonus, retirementBonus, ...x };
    });

    return totals;
  }, [
    dateRanges.base,
    dateRanges.companyBonus,
    dateRanges.meritBonus,
    dateRanges.retirementBonus,
    dates.meritIncrease.day,
    dates.meritIncrease.month,
    emptyMeritSequence,
    meritSequence,
    pay,
    timeSeries.companyBonusPct,
    timeSeries.equityPct,
    timeSeries.meritBonusPct,
    timeSeries.paycheck,
    year,
  ]);
};
