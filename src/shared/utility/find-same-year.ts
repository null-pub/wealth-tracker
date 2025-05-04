import { DateTime } from "luxon";

export function findSameYear<T extends { date: string }>(year: number, data: T[]): T | undefined;
export function findSameYear<T extends { date: string }>(date: DateTime, data: T[]): T | undefined;
export function findSameYear<T extends { date: string }>(date: DateTime | number, data: T[]): T | undefined {
  const year = typeof date === "number" ? date : date.year;
  return data.find((x) => {
    return DateTime.fromISO(x.date).year === year;
  });
}
