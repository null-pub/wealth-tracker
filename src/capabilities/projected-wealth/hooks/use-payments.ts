import { DateTime } from "luxon";
import { useMemo } from "react";
import { useBaseIncome } from "capabilities/projected-wealth/hooks/use-base-income";
import { useCompanyBonus } from "capabilities/projected-wealth/hooks/use-company-bonus";
import { useDateRanges, useDates } from "shared/hooks/use-dates";
import { useMeritBonus } from "capabilities/projected-wealth/hooks/use-merit-bonus";
import { findNearestIdxOnOrBefore } from "shared/utility/find-nearest-on-or-before";

export const usePayments = () => {
  const year = DateTime.local().year;
  const dateRanges = useDateRanges(year);
  const dates = useDates(year);
  const { payPeriods } = useBaseIncome(dateRanges.base.start, dateRanges.base.end);

  const merit = useMeritBonus(year);
  const companyBonus = useCompanyBonus(year);

  return useMemo(() => {
    const cumulativePay = payPeriods.map((x) => {
      return { ...x, cumulative: 0 };
    });

    const payBeforeMerit = findNearestIdxOnOrBefore(dates.meritBonus, cumulativePay, (x) => x.payedOn);

    cumulativePay.splice(payBeforeMerit + 1, 0, {
      cumulative: 0,
      value: merit.cash.actual ?? merit.cash.avg,
      start: dates.meritBonus,
      end: dates.meritBonus,
      payedOn: dates.meritBonus,
    });

    const payBeforeCompanyBonus = findNearestIdxOnOrBefore(dates.companyBonus, cumulativePay, (x) => x.payedOn);

    cumulativePay.splice(payBeforeCompanyBonus + 1, 0, {
      cumulative: 0,
      value: companyBonus.cash.actual ?? companyBonus.cash.avg,
      start: dates.companyBonus,
      end: dates.companyBonus,
      payedOn: dates.companyBonus,
    });

    cumulativePay.forEach((x, i, arr) => {
      x.cumulative = i > 0 ? arr[i - 1].cumulative + x.value : x.value;
    });

    const previousPay = findNearestIdxOnOrBefore(DateTime.local(), payPeriods, (x) => x.payedOn);

    const remainingPayments = payPeriods.length - previousPay;

    return {
      payments: cumulativePay,
      nextPaymentIdx: previousPay + 1,
      numRemaining: remainingPayments,
      totalBasePayments: payPeriods.length,
      totalPayments: cumulativePay.length,
    };
  }, [
    companyBonus.cash.actual,
    companyBonus.cash.avg,
    dates.companyBonus,
    dates.meritBonus,
    merit.cash.actual,
    merit.cash.avg,
    payPeriods,
  ]);
};
