import { differenceInBusinessDays } from "date-fns/differenceInBusinessDays";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { aPayday } from "shared/utility/a-payday";
import { DateRangesOverlap } from "shared/utility/date-ranges-overlap";
import { PayPeriod, getPayPeriods } from "shared/utility/get-pay-periods";
import { useProjectedPay } from "./use-projected-pay";

export type IncomePerPeriod = {
  perPayday: number;
  count: number;
  start: DateTime;
  end: DateTime;
  value: number;
};

export interface BaseIncome {
  totalIncome: number;
  payPeriods: (PayPeriod & { value: number })[];
  incomePerPeriod: IncomePerPeriod[];
}

export const useBaseIncome = (startDate: DateTime, endDate: DateTime): BaseIncome => {
  const pay = useProjectedPay();

  return useMemo(() => {
    const payPeriods = getPayPeriods(aPayday, startDate, endDate).map((payPeriod) => {
      const dateRanges = pay.filter((_pay) => DateRangesOverlap(_pay, payPeriod));
      const payDuringPeriod = dateRanges.map((__pay) => {
        const start = DateTime.max(__pay.start, payPeriod.start);
        const end = DateTime.min(__pay.end, payPeriod.end);
        const businessDays = differenceInBusinessDays(end.plus({ millisecond: 1 }).toJSDate(), start.toJSDate());
        const value = (__pay.value / 10) * Math.round(businessDays);
        return {
          start,
          end,
          value,
        };
      });
      const sum = payDuringPeriod.reduce((acc, curr) => acc + curr.value, 0);

      return {
        ...payPeriod,
        value: sum,
      };
    });

    const totalIncome = payPeriods.reduce((acc, curr) => acc + curr.value, 0);

    const incomePerPeriod = payPeriods
      .reduceRight((acc, curr) => {
        if (acc[0]?.[0]?.value === curr.value) {
          acc[0].unshift(curr);
        } else {
          acc.unshift([curr]);
        }

        return acc;
      }, [] as (typeof payPeriods)[])
      .reduce((acc, curr) => {
        acc.push({
          start: curr[0].payedOn,
          end: curr[curr.length - 1].payedOn,
          value: curr.reduce((acc, curr) => acc + curr.value, 0),
          perPayday: curr[0].value,
          count: curr.length,
        });
        return acc;
      }, [] as IncomePerPeriod[]);

    return { totalIncome, payPeriods, incomePerPeriod };
  }, [startDate, endDate, pay]);
};
