import { DateTime } from "luxon";

export const getEligibleIncomeDateRanges = (year: number) => ({
  base: {
    start: DateTime.fromObject({ month: 1, day: 1, year }).toValid(),
    end: DateTime.fromObject({ month: 12, day: 31, year }).endOf("day").toValid(),
  },
  meritBonus: {
    start: DateTime.fromObject({ month: 1, day: 1, year: year - 1 }).toValid(),
    end: DateTime.fromObject({ month: 12, day: 31, year: year - 1 })
      .endOf("day")
      .toValid(),
  },
  companyBonus: {
    start: DateTime.fromObject({ day: 1, month: 4, year: year - 1 }).toValid(),
    end: DateTime.fromObject({ day: 31, month: 3, year }).endOf("day").toValid(),
  },
  retirementBonus: {
    start: DateTime.fromObject({ day: 1, month: 7, year: year - 1 }).toValid(),
    end: DateTime.fromObject({ day: 30, month: 6, year }).endOf("day").toValid(),
  },
});
