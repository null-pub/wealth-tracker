import { DateTime } from "luxon";
import { AccountData } from "shared/models/store/current";

export function findSameYear(year: number, data: AccountData[]): AccountData | undefined;
export function findSameYear(date: DateTime, data: AccountData[]): AccountData | undefined;
export function findSameYear(date: DateTime | number, data: AccountData[]): AccountData | undefined {
  const year = typeof date === "number" ? date : date.year;
  return data.find((x) => {
    return DateTime.fromISO(x.date).year === year;
  });
}
