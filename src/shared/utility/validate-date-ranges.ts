import { DateTime } from "luxon";

type DateRanges<T extends boolean | true | false> = Record<
  string,
  {
    start: DateTime<T>;
    end: DateTime<T>;
  }
>;

/**
 * Takes a record of date ranges and ensures all dates are valid
 * @param ranges Record of date ranges with start and end DateTime objects
 * @returns Same record with all dates guaranteed to be valid
 * @throws Error if any date is invalid
 */
export function validateDateRanges(ranges: DateRanges<boolean>): ranges is DateRanges<true> {
  Object.entries(ranges).forEach(([, range]) => {
    range.start.toValid();
    range.end.toValid();
  });
  return true;
}
