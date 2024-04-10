import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useDateRanges } from "shared/hooks/use-dates";
import { valueByDateRange } from "shared/hooks/use-projected-pay";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { findSameYear } from "shared/utility/find-same-year";
import { PaymentPeriod, getPayments } from "shared/utility/get-payments";
import { ckmeans, sumSimple } from "simple-statistics";

interface GradientResult {
  meritRate: number;
  meritBonusRate: number;
  companyBonusRate: number;
  companyBonusFactor: number;
  payments: PaymentPeriod[];
  bonuses: number[];
}

const incomeByRange = (range: { start: DateTime; end: DateTime }, pay: PaymentPeriod[]) => {
  return pay
    .filter((x) => x.payedOn >= range.start && x.payedOn <= range.end)
    .reduce((acc, curr) => acc + curr.value, 0);
};

export const useGradient2 = () => {
  /*
 
  ()=>
    if Y-0 exists & Y-1 does not & (Merit / equity exist) for Y-0 //(aka this year but after april first)
      return Y-0 and generate Y-1

    if there is not a paycheck for Y-0 & Y-1 //(aka the future)
      generate all possible ways to arrive at Y-1.
      using all Merit / Merit bonus pairs generate all possible Y-0 / Y-1 pairs
    
    generate all company bonus scenarios for each prior set of scenarios

    generate payments for Y-1 jan 1 thru Y-0 dec 31
    compute bonuses , income

    run ckmeans for 3 buckets


  */
};

export const useGradient = () => {
  const year = getLocalDateTime().year;
  const dateRanges = useDateRanges(year);
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);

  return useMemo(() => {
    const equityPct = findSameYear(year, timeSeries.equityPct);
    const meritIncreasePct = findSameYear(year, timeSeries.meritIncreasePct);
    const meritBonusPct = findSameYear(year, timeSeries.meritBonusPct);

    const foundMerit = {
      bonusPct: meritBonusPct?.value ?? 0,
      meritIncreasePct: (meritIncreasePct?.value ?? 0) + (equityPct?.value ?? 0),
    };

    const meritPairs = timeSeries.meritIncreasePct.map((x) => {
      const bonusPct = findSameYear(DateTime.fromISO(x.date).year, timeSeries.meritBonusPct)?.value ?? 0;
      return {
        bonusPct,
        meritIncreasePct: x.value + (equityPct?.value ?? 0),
      };
    });

    const b = timeSeries.meritIncreasePct.map((x) => 1 + x.value);
    const d = [new Set(b)];

    for (let i = 0; i < 4; i++) {
      const d2 = new Set<number>();
      [...(d.at(-1)?.values() ?? [])].forEach((x) => {
        b.forEach((y) => d2.add(x * y));
      });
      d.push(d2);
    }

    const c = [...(d.at(-1) ?? [])];

    const pay = findSameYear(year, timeSeries.paycheck)?.value ?? 1;
    const y = new Map<number, number[]>();
    b.forEach((a) => {
      return c.forEach((b) => {
        y.set(a * b, [Math.round(b * pay), Math.round(a * b * pay)]);
      });
    });

    const xx = ckmeans(
      [...y.values()].map(([, x]) => x),
      4
    );

    console.log(
      xx,
      xx.map((x) => [Math.min(...x), Math.max(...x), x.length / y.size])
    );

    const uniquePairs = Object.entries(Object.groupBy(meritPairs, (x) => x.bonusPct ** x.meritIncreasePct)).map(
      ([, value]) => value!.at(0)!
    );

    const lastThreeMeritBonus = timeSeries.meritBonusPct
      .filter((x) => DateTime.fromISO(x.date).year <= year)
      .slice(-3)
      .reduce((acc, curr) => acc + curr.value, 0);

    const uniqueCompanyBonusPcts = [...new Set(timeSeries.companyBonusPct.map((x) => x.value))];

    console.log("uniqueMerits", uniquePairs);

    //todo for each unique merit increase create seperate branching futures.
    const basePaychecks = timeSeries.paycheck.filter((x) => {
      const payYear = DateTime.fromISO(x.date).year;
      return payYear === year - 1 || payYear === year - 2;
    });
    console.log("basePaychecks", basePaychecks);

    const gMerits = (meritIncreasePct ? [foundMerit] : uniquePairs).map((merit): Partial<GradientResult> => {
      const payByDateRanges = valueByDateRange(
        basePaychecks.slice().concat({
          date: DateTime.fromObject({ month: 4, day: 1, year }).toISO()!,
          value: (basePaychecks.at(-1)?.value ?? 0) * (1 + merit.meritIncreasePct),
          id: "",
        })
      );
      const payments = getPayments(
        DateTime.fromObject({ month: 1, day: 1, year: year - 1 }),
        DateTime.fromObject({ month: 12, day: 31, year }).endOf("day"),
        payByDateRanges
      );
      const bonus = incomeByRange(dateRanges.meritBonus, payments ?? []) * merit.bonusPct;
      return {
        payments,
        meritRate: merit.meritIncreasePct,
        meritBonusRate: merit.bonusPct,
        bonuses: [bonus],
      };
    });
    console.log("gMerits", gMerits);

    const gCompanyBonus = uniqueCompanyBonusPcts.flatMap((bonusPct) => {
      return gMerits.map((x) => {
        const bonus = incomeByRange(dateRanges.companyBonus, x.payments ?? []) * bonusPct * lastThreeMeritBonus;
        return {
          ...x,
          companyBonusRate: bonusPct * lastThreeMeritBonus,
          companyBonusFactor: bonusPct,
          bonuses: (x.bonuses ?? []).concat(bonus),
        };
      });
    });

    console.log("gCompanyBonus", gCompanyBonus);

    const gRetirementBonus = gCompanyBonus.map((x) => {
      const bonus = (incomeByRange(dateRanges.retirementBonus, x.payments ?? []) + sumSimple(x.bonuses)) * 0.15;
      return {
        ...x,
        bonuses: (x.bonuses ?? []).concat(bonus),
      };
    });

    console.log("gRetirementBonus", gRetirementBonus);

    const gIncome = gRetirementBonus.map((x) => {
      const pay = incomeByRange(dateRanges.base, x.payments ?? []);
      const bonuses = x.bonuses.reduce((acc, curr) => acc + curr, 0);
      return {
        income: Math.round(pay + bonuses),
        ...x,
      };
    });

    console.log("gIncome", gIncome);

    const ck = ckmeans(
      gIncome.map((x) => x.income),
      Math.min(3, gIncome.length)
    );
    console.log(
      "ckmeans",
      ck,
      ck.map((x) => [Math.min(...x), Math.max(...x), x.length / gIncome.length])
    );
  }, [
    dateRanges.base,
    dateRanges.companyBonus,
    dateRanges.meritBonus,
    dateRanges.retirementBonus,
    timeSeries.companyBonusPct,
    timeSeries.equityPct,
    timeSeries.meritBonusPct,
    timeSeries.meritIncreasePct,
    timeSeries.paycheck,
    year,
  ]);
};
