import { differenceInBusinessDays } from "date-fns/differenceInBusinessDays";
import { DateTime } from "luxon";
import { aPayday } from "./a-payday";
import { DateRangesOverlap } from "./date-ranges-overlap";
import { getPayPeriods } from "./get-pay-periods";

export interface PaymentPeriod {
  start: string;
  end: string;
  payedOn: string;
  value: number;
  cumulative: number;
}

export interface ProjectedPay {
  start: DateTime<true> | DateTime<false>;
  end: DateTime<true> | DateTime<false>;
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
        start: start.toISO(),
        end: end.toISO(),
        value,
      };
    });
    const sum = payDuringPeriod.reduce((acc, curr) => acc + curr.value, 0);

    return {
      value: sum,
      cumulative: 0,
      start: payPeriod.start.toISO()!,
      end: payPeriod.end.toISO()!,
      payedOn: payPeriod.payedOn.toISO()!,
    };
  });
}
