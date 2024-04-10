import { differenceInBusinessDays } from "date-fns/differenceInBusinessDays";
import { DateTime } from "luxon";
import { ProjectedPay } from "shared/hooks/use-projected-pay";
import { aPayday } from "./a-payday";
import { DateRangesOverlap } from "./date-ranges-overlap";
import { PayPeriod, getPayPeriods } from "./get-pay-periods";

export interface PaymentPeriod extends PayPeriod {
  value: number;
}

export function getPayments(startDate: DateTime, endDate: DateTime, pay: ProjectedPay[]): PaymentPeriod[] {
  const payPeriods = getPayPeriods(aPayday, startDate, endDate);
  return payPeriods.map((payPeriod) => {
    const dateRanges = pay.filter((x) => DateRangesOverlap(x, payPeriod));
    const payDuringPeriod = dateRanges.map((x) => {
      const start = DateTime.max(x.start, payPeriod.start);
      const end = DateTime.min(x.end, payPeriod.end);
      const businessDays = differenceInBusinessDays(end.plus({ milliseconds: 1 }).toJSDate(), start.toJSDate());
      const value = (x.value / 10) * Math.max(1, businessDays);
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
}
