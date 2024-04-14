import { DateTime } from "luxon";
import { findSameYear } from "shared/utility/find-same-year";
import { getPayments } from "shared/utility/get-payments";
import { incomeByRange } from "shared/utility/income-by-range";
import { ProjectedIncome } from "shared/models/store/current";
import { getEmptyMeritSequence, getMeritSequence } from "./merit-sequence";
import { valueByDateRange } from "shared/utility/get-values-by-date-range";
import { Scenario } from "shared/models/scenario";

export const getScenarios = (year: number, projectedIncome: ProjectedIncome): Scenario[] => {
  const startTime = performance.now();

  const dates = { meritIncrease: DateTime.fromObject({ month: 4, day: 1, year }) };
  const dateRanges = {
    base: {
      start: DateTime.fromObject({ month: 1, day: 1, year }),
      end: DateTime.fromObject({ month: 12, day: 31, year }).endOf("day"),
    },
    meritBonus: {
      start: DateTime.fromObject({ month: 1, day: 1, year: year - 1 }),
      end: DateTime.fromObject({ month: 12, day: 31, year: year - 1 }).endOf("day"),
    },
    companyBonus: {
      start: DateTime.fromObject({ day: 1, month: 4, year: year - 1 }),
      end: DateTime.fromObject({ day: 31, month: 3, year }).endOf("day"),
    },
    retirementBonus: {
      start: DateTime.fromObject({ day: 1, month: 7, year: year - 1 }),
      end: DateTime.fromObject({ day: 30, month: 6, year }).endOf("day"),
    },
  };
  const timeSeries = projectedIncome.timeSeries;
  const meritSequence = getMeritSequence(year, projectedIncome);

  const pay = timeSeries.paycheck.filter((x) => {
    const date = DateTime.fromISO(x.date);
    return date.year > year - 3 && date.year <= year;
  });

  const emptyMeritSequence = getEmptyMeritSequence(year, projectedIncome, pay);

  const mostRecentPay = pay.at(-1) ?? timeSeries.paycheck.at(-1);
  if (!mostRecentPay) {
    return [];
  }

  const equityIncreasePct = findSameYear(year, timeSeries.equityPct)?.value ?? 0;
  const companyBonusFactor = findSameYear(year, timeSeries.companyBonusPct);
  const companyBonusPcts = companyBonusFactor
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

            if (date.year > year) {
              break;
            }

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
          const lastThreeMeritBonuses = actualMeritBonusPcts.concat(fakeMerit).slice(-3);
          const lastThreeMeritBonusFactor = lastThreeMeritBonuses.reduce((acc, curr) => acc + curr, 0);

          const lastMerit = merits.at(-1)!;
          const payments = getPayments(
            DateTime.fromObject({ day: 1, month: 1, year: year - 1 }),
            DateTime.fromObject({ day: 31, month: 12, year: year }).endOf("day"),
            valueByDateRange(next)
          );

          return {
            pay: next,
            lastThreeMeritBonusFactor,
            lastThreeMeritBonuses,
            meritBonusPct: lastMerit.meritBonusPct,
            meritIncreasePct: lastMerit.meritIncreasePct,
            payments,
            equityIncreasePct,
            retirementBonusPct: 0.15,
          };
        });

  const withCompanyBonus = companyBonusPcts.flatMap((x) => {
    return basePayAndMeritScenarios.map((y) => {
      return { ...y, companyBonusFactor: x, companyBonusPct: y.lastThreeMeritBonusFactor * x };
    });
  });

  const totals = withCompanyBonus.map((x) => {
    const aprToApr = (x.pay.at(-1)?.value ?? 0) * 26;
    const basePay = Math.round(incomeByRange(dateRanges.base, x.payments));

    const meritBonus =
      findSameYear(year, timeSeries.meritBonus)?.value ??
      Math.round(incomeByRange(dateRanges.meritBonus, x.payments) * x.meritBonusPct);

    const companyBonus =
      findSameYear(year, timeSeries.companyBonus)?.value ??
      Math.round(incomeByRange(dateRanges.companyBonus, x.payments) * x.companyBonusPct);

    const retirementBonus =
      findSameYear(year, timeSeries.retirementBonus)?.value ??
      Math.round((meritBonus + companyBonus + incomeByRange(dateRanges.retirementBonus, x.payments)) * 0.15);

    const totalPay = Math.round(
      [basePay, meritBonus, companyBonus, retirementBonus].reduce((acc, curr) => acc + curr, 0)
    );

    const taxablePay = Math.round([basePay, meritBonus, companyBonus].reduce((acc, curr) => acc + curr, 0));
    return { totalPay, basePay, meritBonus, companyBonus, retirementBonus, taxablePay, aprToApr, ...x };
  });

  const endTime = performance.now();
  console.log(`generating ${totals.length} scenarios took ${Math.round(endTime - startTime)} milliseconds`);
  return totals;
};