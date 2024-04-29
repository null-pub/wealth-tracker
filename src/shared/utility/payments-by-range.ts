import { DateTime } from "luxon";
import { PaymentPeriod, PaymentType } from "shared/models/payment-periods";

export const paymentsByRange = (
  types: PaymentType[],
  range: { start: DateTime; end: DateTime },
  pay: PaymentPeriod[]
) => {
  const setTypes = new Set(types);

  return pay.filter((x) => {
    const payedOn = DateTime.fromISO(x.payedOn);
    return payedOn >= range.start && payedOn <= range.end && setTypes.has(x.type);
  });
};
