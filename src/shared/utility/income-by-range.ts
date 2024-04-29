import { DateTime } from "luxon";
import { PaymentPeriod, PaymentType } from "shared/models/payment-periods";
import { paymentsByRange } from "./payments-by-range";

export const incomeByRange = (
  types: PaymentType[],
  range: { start: DateTime; end: DateTime },
  pay: PaymentPeriod[]
) => {
  return paymentsByRange(types, range, pay).reduce((acc, curr) => acc + curr.value, 0);
};
