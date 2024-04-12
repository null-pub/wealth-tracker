import { DateTime } from "luxon";
import { useMemo } from "react";
import { useProjectedPay } from "capabilities/projected-wealth/hooks/use-projected-pay";

export const usePaycheck = (date: DateTime) => {
  const paychecks = useProjectedPay();

  const paycheck = useMemo(() => {
    return paychecks.find(({ start }) => start.year === date.year)?.value ?? 0;
  }, [date.year, paychecks]);

  return paycheck;
};
