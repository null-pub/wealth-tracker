import { DateTime } from "luxon";
import { PaymentType } from "./payment-periods";

export type IncomePerPeriod = {
  perPayday: number;
  count: number;
  start: DateTime;
  end: DateTime;
  value: number;
  type: PaymentType;
};
