import { DateTime } from "luxon";
import { AccountData } from "shared/models/account-data";

export const findNearestOnOrBefore = (date: DateTime, data: AccountData[]) => {
  return data.find((x, idx, array) => {
    if (idx == 0 && DateTime.fromISO(x.date).startOf("day") >= date) {
      return true;
    }

    if (
      idx < array.length - 1 &&
      DateTime.fromISO(x.date).startOf("day") <= date &&
      DateTime.fromISO(data[idx + 1].date).startOf("day") > date
    ) {
      return true;
    }

    if (idx === array.length - 1) {
      return true;
    }
  });
};

export const findNearestIdxOnOrBefore = <T>(date: DateTime, data: T[], selector: (data: T) => DateTime) => {
  return data.findIndex((x, idx, array) => {
    if (idx == 0 && selector(x) >= date) {
      return true;
    }

    if (idx < array.length - 1 && selector(x) <= date && selector(data[idx + 1]) > date) {
      return true;
    }

    if (idx === array.length - 1) {
      return true;
    }
  });
};
