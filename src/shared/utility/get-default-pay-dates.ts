import { DateTime } from "luxon";

export const getDefaultPayDates = (year?: number) => {
  return {
    meritIncrease: DateTime.fromObject({ month: 4, day: 1, year }),
    meritBonus: DateTime.fromObject({ month: 4, day: 15, year }),
    companyBonus: DateTime.fromObject({ month: 6, day: 15, year }),
    retirementBonus: DateTime.fromObject({ month: 7, day: 15, year }),
  };
};
