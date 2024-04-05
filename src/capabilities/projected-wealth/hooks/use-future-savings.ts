import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";

export const useFutureSavings = () => {
  const config = useStore(store, (x) => x.projectedWealth);
  return useMemo(() => {
    const systemYear = getLocalDateTime().year;
    return {
      remaining:
        config.savingsPerMonth *
        DateTime.fromObject({
          day: 31,
          month: 12,
          year: systemYear,
        })
          .endOf("day")
          .diffNow("months").months,
      perMonth: config.savingsPerMonth,
    };
  }, [config.savingsPerMonth]);
};
