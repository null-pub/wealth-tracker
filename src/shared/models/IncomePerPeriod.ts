import { DateTime } from "luxon";

export type IncomePerPeriod = {
  perPayday: number;
  count: number;
  start: DateTime;
  end: DateTime;
  value: number;
};
