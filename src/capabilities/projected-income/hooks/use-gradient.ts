import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useDateRanges, useDates } from "shared/hooks/use-dates";
import { valueByDateRange } from "shared/hooks/use-projected-pay";
import { AccountData } from "shared/models/account-data";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import { PaymentPeriod, getPayments } from "shared/utility/get-payments";
import { groupBySingle } from "shared/utility/group-by";
import { ckmeans } from "simple-statistics";

const incomeByRange = (range: { start: DateTime; end: DateTime }, pay: PaymentPeriod[]) => {
  return pay
    .filter((x) => x.payedOn >= range.start && x.payedOn <= range.end)
    .reduce((acc, curr) => acc + curr.value, 0);
};

export const useScenarios = (year: number) => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const dates = useDates(year);
  const dateRanges = useDateRanges(year);

  console.log("year", year);

  const payAndMerit = useMemo(() => {
    const pay = timeSeries.paycheck.filter((x) => DateTime.fromISO(x.date).year > year - 3);
    const mostRecent = pay.at(-1) ?? timeSeries.paycheck.at(-1);
    if (!mostRecent) {
      return [];
    }
    const yearsToGenerate = year - DateTime.fromISO(mostRecent.date).year;
    console.log("yearsToGenerate", yearsToGenerate);
    const meritPairs = getMeritPairs(timeSeries.meritIncreasePct, timeSeries.meritBonusPct);
    const meritSequence = generateMeritSequence(meritPairs, yearsToGenerate);

    const paycheckData =
      meritSequence.length > 0
        ? meritSequence.map((merits) => {
            const next = pay.slice();
            const initial = next.length;
            for (let i = initial; i < merits.length + initial; i++) {
              const prior = next[i - 1] ?? mostRecent;
              const date = DateTime.fromISO(prior.date ?? mostRecent.date)
                .plus({ years: 1 })
                .set({ month: dates.meritIncrease.month, day: dates.meritIncrease.day });
              const equity = findSameYear(date.year, timeSeries.equityPct)?.value ?? 0;
              next.push({
                date: date.toISO()!,
                value: prior.value * (1 + merits[i - initial].meritIncreasePct + equity),
                id: "",
              });
            }

            const realMerit = pay.map(
              (x) => findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct)?.value ?? 0
            );
            const fakeMerit = merits.map((x) => x.meritBonusPct);
            const lastThreeMeritBonus = realMerit
              .concat(fakeMerit)
              .slice(-3)
              .reduce((acc, curr) => acc + curr, 0);

            return {
              pay: next,
              lastThreeMeritBonus,
              ...merits.at(-1)!,
            };
          })
        : [
            (() => {
              const realMeritBonus = pay.map(
                (x) => findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct)?.value ?? 0
              );
              const meritIncreasePct = findSameYear(year, timeSeries.meritIncreasePct);

              const lastThreeMeritBonus = realMeritBonus.slice(-3).reduce((acc, curr) => acc + curr, 0);

              return {
                pay: pay.slice(),
                lastThreeMeritBonus,
                meritIncreasePct: meritIncreasePct,
                meritBonusPct: realMeritBonus.at(-1)!,
              };
            })(),
          ];

    const equityIncreasePct = findSameYear(year, timeSeries.equityPct)?.value ?? 0;
    const scenarios = paycheckData.map(({ meritBonusPct, meritIncreasePct, lastThreeMeritBonus, ...x }) => {
      const pay = valueByDateRange(x.pay);
      const payments = getPayments(
        DateTime.fromObject({ day: 1, month: 1, year: year - 1 }),
        DateTime.fromObject({ day: 31, month: 12, year: year }).endOf("day"),
        pay
      );
      return {
        pay,
        payments,
        meritBonusPct,
        meritIncreasePct,
        equityIncreasePct,
        lastThreeMeritBonus,
        retirementBonusPct: 0.15,
      };
    });

    const uniqueCompanyBonusPcts = [...new Set(timeSeries.companyBonusPct.map((x) => x.value))];

    const withCompanyBonus = uniqueCompanyBonusPcts.flatMap((x) => {
      return scenarios.map((y) => {
        return { ...y, companyBonusFactor: x, companyBonusPct: y.lastThreeMeritBonus * x };
      });
    });

    let totals = withCompanyBonus.map((x) => {
      const basePay = Math.round(incomeByRange(dateRanges.base, x.payments));
      const meritBonus = Math.round(incomeByRange(dateRanges.meritBonus, x.payments) * x.meritBonusPct);
      const companyBonus = Math.round(incomeByRange(dateRanges.companyBonus, x.payments) * x.companyBonusPct);
      const retirementBonus = Math.round(incomeByRange(dateRanges.retirementBonus, x.payments) * 0.15);
      const totalPay = Math.round(
        [basePay, meritBonus, companyBonus, retirementBonus].reduce((acc, curr) => acc + curr, 0)
      );

      return { totalPay, basePay, meritBonus, companyBonus, retirementBonus, ...x };
    });

    const meritBonus = findSameYear(year, timeSeries.meritBonusPct);
    if (meritBonus) {
      totals = totals.filter((x) => x.meritBonusPct === meritBonus.value);
    }

    const companyBonusFactor = findSameYear(year, timeSeries.companyBonusPct);
    if (companyBonusFactor) {
      totals = totals.filter((x) => x.companyBonusFactor === companyBonusFactor.value);
    }

    const ck = ckmeans(
      totals.map((x) => x.totalPay),
      Math.min(3, totals.length)
    );
    console.log(
      totals,
      "ckmeans",
      ck,
      ck.map((x) => [Math.min(...x), Math.max(...x), x.length / totals.length])
    );
  }, [
    dateRanges.base,
    dateRanges.companyBonus,
    dateRanges.meritBonus,
    dateRanges.retirementBonus,
    dates.meritIncrease.day,
    dates.meritIncrease.month,
    timeSeries.companyBonusPct,
    timeSeries.equityPct,
    timeSeries.meritBonusPct,
    timeSeries.meritIncreasePct,
    timeSeries.paycheck,
    year,
  ]);

  return payAndMerit;
};

export const useGradient2 = () => {
  useScenarios(2024);
};

function generateMeritSequence(
  meritPairs: { originalDate: DateTime; meritIncreasePct: number; meritBonusPct: number }[],
  yearsToGenerate: number
) {
  if (yearsToGenerate === 0) {
    return [];
  }
  const exists = new Set<number>();
  let meritSequence = meritPairs.slice().map((x) => [x]);
  for (let i = 0; i < yearsToGenerate - 1; i++) {
    meritSequence = meritSequence
      .flatMap((x) => {
        return meritPairs.map((merit) => {
          return x.slice().concat(merit);
        });
      })
      .filter((x) => {
        const sum = x.reduce((acc, curr) => acc + curr.meritIncreasePct, 0);
        const doesExist = exists.has(sum);
        exists.add(sum);
        return doesExist == false;
      });
  }
  return meritSequence;
}

function getMeritPairs(meritIncreasePct: AccountData[], meritBonusPct: AccountData[]) {
  return Object.values(
    groupBySingle(
      meritIncreasePct.map((x) => {
        const meritBonusPctPair = findSameYear(DateTime.fromISO(x.date).year, meritBonusPct);

        return {
          originalDate: DateTime.fromISO(x.date),
          meritIncreasePct: x.value,
          meritBonusPct: meritBonusPctPair?.value ?? 0,
        };
      }),
      (x) => x.meritIncreasePct * 1000 + x.meritBonusPct
    )
  );
}
