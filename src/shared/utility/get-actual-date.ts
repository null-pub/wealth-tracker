import { DateTime } from "luxon";
import { AccountData } from "shared/models/store/current";
import { findSameYear } from "./find-same-year";

export const getActualDate = (year: number | undefined, data: AccountData[]) => {
  if (!year) {
    return undefined;
  }

  const entry = findSameYear(year, data);
  if (!entry) {
    return undefined;
  }

  return DateTime.fromISO(entry.date);
};
