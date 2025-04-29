import { DateTime } from "luxon";
import { Account, AccountData } from "shared/models/store/current";

const hasJanFistEntry = (x: AccountData, year: number) => {
  const date = DateTime.fromISO(x.date);
  const janFirst = DateTime.fromObject({
    day: 1,
    month: 1,
    year: +year,
  });

  return date.diff(janFirst, ["days", "hours"]).days == 0;
};

export const useMissingYears = (account: Account) => {
  const accountItemsByYear = Object.groupBy(account.data, (x) => DateTime.fromISO(x.date).year);
  if (account.data.length === 0) {
    return [];
  }

  const years = Object.entries(accountItemsByYear)
    .filter(([year, entries]) => !!entries?.find((entry) => hasJanFistEntry(entry, +year)))
    .map(([year]) => +year)
    .sort();

  const lookup = new Set(years);
  const missing = [];

  for (let i = years[0]; i <= years[years.length - 1]; i++) {
    !lookup.has(i) && missing.push(i);
  }

  return missing;
};
