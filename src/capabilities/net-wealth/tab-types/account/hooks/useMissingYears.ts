import { DateTime } from "luxon";
import { Account } from "shared/models/store/current";

export const useMissingYears = (account: Account) => {
  const years = Object.entries(Object.groupBy(account.data, (x) => DateTime.fromISO(x.date).year))
    .map(
      ([year, entries]) =>
        [
          +year,
          !!entries?.find((x) => {
            const date = DateTime.fromISO(x.date);
            const janFirst = DateTime.fromObject({
              day: 1,
              month: 1,
              year: +year,
            });
            return date.diff(janFirst, ["days", "hours"]).days == 0;
          }),
        ] as [number, boolean]
    )
    .sort(([a], [b]) => {
      return a - b;
    });

  const lookup = Object.fromEntries(years);
  const missing = [];
  for (let i = years[0]?.[0] ?? 0; i <= years[years.length - 1]?.[0]; i++) {
    if (!lookup[i]) {
      missing.push(i);
    }
  }
  return missing;
};
