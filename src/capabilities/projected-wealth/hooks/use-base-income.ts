import { DateTime } from "luxon";
import { useMemo } from "react";
import { PayPeriod } from "shared/utility/get-pay-periods";
import { useProjectedPay } from "./use-projected-pay";
import { getPayments } from "shared/utility/get-payments";
import { IncomePerPeriod } from "shared/models/IncomePerPeriod";

export interface BaseIncome {
  totalIncome: number;
  payPeriods: (PayPeriod & { value: number })[];
  incomePerPeriod: IncomePerPeriod[];
}

export const useBaseIncome = (startDate: DateTime, endDate: DateTime): BaseIncome => {
  const pay = useProjectedPay();

  return useMemo(() => {
    const payPeriods = getPayments(startDate, endDate, pay);
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
          start: DateTime.fromISO(curr[0].payedOn),
          end: DateTime.fromISO(curr[curr.length - 1].payedOn),
          value: curr.reduce((acc, curr) => acc + curr.value, 0),
          perPayday: curr[0].value,
          count: curr.length,
        });
        return acc;
      }, [] as IncomePerPeriod[]);

    return {
      totalIncome,
      payPeriods: payPeriods.map((x) => {
        return {
          ...x,
          payedOn: DateTime.fromISO(x.payedOn),
          start: DateTime.fromISO(x.start),
          end: DateTime.fromISO(x.end),
        };
      }),
      incomePerPeriod,
    };
  }, [startDate, endDate, pay]);
};
