import { DateTime } from "luxon";
import { PaymentPeriod } from "./get-payments";

export const incomeByRange = (
  types: ("bonus" | "regular")[],
  range: { start: DateTime; end: DateTime },
  pay: PaymentPeriod[]
) => {
  const setTypes = new Set(types);

  return pay
    .filter((x) => {
      const payedOn = DateTime.fromISO(x.payedOn);
      return payedOn >= range.start && payedOn <= range.end && setTypes.has(x.type);
    })
    .reduce((acc, curr) => acc + curr.value, 0);
};
