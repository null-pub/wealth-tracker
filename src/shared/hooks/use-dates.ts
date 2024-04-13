import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { AccountData } from "shared/models/account-data";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";

const useRealDate = (year: number | undefined, data: AccountData[]) => {
  return useMemo(() => {
    if (!year) {
      return undefined;
    }
    const meritBonus = findSameYear(year, data);
    if (!meritBonus) {
      return undefined;
    }

    return DateTime.fromISO(meritBonus.date);
  }, [data, year]);
};

export const useDates = (year?: number) => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);

  const meritBonusDate = useRealDate(year, timeSeries.meritBonus);
  const companyBonusDate = useRealDate(year, timeSeries.companyBonus);

  return useMemo(() => {
    return {
      meritIncrease: DateTime.fromObject({ month: 4, day: 1, year }),
      meritBonus: meritBonusDate ?? DateTime.fromObject({ month: 4, day: 15, year }),
      companyBonus: companyBonusDate ?? DateTime.fromObject({ month: 6, day: 15, year }),
      retirementBonus: DateTime.fromObject({ month: 7, day: 15, year }),
    };
  }, [companyBonusDate, meritBonusDate, year]);
};

export const useDateRanges = (year: number) => {
  return useMemo(
    () => ({
      base: {
        start: DateTime.fromObject({ month: 1, day: 1, year }),
        end: DateTime.fromObject({ month: 12, day: 31, year }).endOf("day"),
      },
      meritBonus: {
        start: DateTime.fromObject({ month: 1, day: 1, year: year - 1 }),
        end: DateTime.fromObject({ month: 12, day: 31, year: year - 1 }).endOf("day"),
      },
      companyBonus: {
        start: DateTime.fromObject({ day: 1, month: 4, year: year - 1 }),
        end: DateTime.fromObject({ day: 31, month: 3, year }).endOf("day"),
      },
      retirementBonus: {
        start: DateTime.fromObject({ day: 1, month: 7, year: year - 1 }),
        end: DateTime.fromObject({ day: 30, month: 6, year }).endOf("day"),
      },
    }),
    [year]
  );
};
