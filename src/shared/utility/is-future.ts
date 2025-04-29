import { DateTime } from "luxon";

export const isFuture = (date: DateTime) => date.diffNow("milliseconds").milliseconds > 0;
