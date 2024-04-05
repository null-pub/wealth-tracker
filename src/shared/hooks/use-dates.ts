import { DateTime } from "luxon";
import { useMemo } from "react";

export const useDates = (year?: number) =>
  useMemo(() => {
    return {
      meritIncrease: DateTime.fromObject({ month: 4, day: 1, year }),
      meritBonus: DateTime.fromObject({ month: 4, day: 15, year }),
      companyBonus: DateTime.fromObject({ month: 6, day: 15, year }),
      retirementBonus: DateTime.fromObject({ month: 7, day: 15, year }),
    };
  }, [year]);

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
