import { DateTime } from "luxon";
import { useMemo } from "react";
import { useProjectedPay } from "shared/hooks/use-projected-pay";

export const usePaycheck = (date: DateTime) => {
  const paychecks = useProjectedPay();

  const paycheck = useMemo(() => {
    return paychecks.find(({ start }) => start.year === date.year)?.value ?? 0;
  }, [date.year, paychecks]);

  return paycheck;
};
