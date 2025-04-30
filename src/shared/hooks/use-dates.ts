import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { store } from "shared/store";
import { getActualDate } from "shared/utility/get-actual-date";

export const getDefaultPayDates = (year?: number) => {
  return {
    meritIncrease: DateTime.fromObject({ month: 4, day: 1, year }),
    meritBonus: DateTime.fromObject({ month: 4, day: 15, year }),
    companyBonus: DateTime.fromObject({ month: 6, day: 15, year }),
    retirementBonus: DateTime.fromObject({ month: 7, day: 15, year }),
  };
};

export const useDates = (year?: number) => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const meritBonusDate = getActualDate(year, timeSeries.meritBonus);
  const companyBonusDate = getActualDate(year, timeSeries.companyBonus);
  const retirementBonusDate = getActualDate(year, timeSeries.retirementBonus);
  const defaultDates = getDefaultPayDates(year);

  return {
    meritIncrease: defaultDates.meritIncrease,
    meritBonus: meritBonusDate ?? defaultDates.meritBonus,
    companyBonus: companyBonusDate ?? defaultDates.companyBonus,
    retirementBonus: retirementBonusDate ?? defaultDates.retirementBonus,
  };
};

export const getDateRanges = (year: number) => ({
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
});

export const useDateRanges = (year: number) => {
  return getDateRanges(year);
};
