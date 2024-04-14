import { DateTime } from "luxon";
import { PaymentPeriod } from "./get-payments";

export const incomeByRange = (range: { start: DateTime; end: DateTime }, pay: PaymentPeriod[]) => {
  return pay
    .filter((x) => {
      const payedOn = DateTime.fromISO(x.payedOn);
      return payedOn >= range.start && payedOn <= range.end;
    })
    .reduce((acc, curr) => acc + curr.value, 0);
};
