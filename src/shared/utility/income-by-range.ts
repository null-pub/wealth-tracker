import { DateTime } from "luxon";
import { PaymentPeriod } from "./get-payments";

export const incomeByRange = (range: { start: DateTime; end: DateTime }, pay: PaymentPeriod[]) => {
  return pay
    .filter((x) => x.payedOn >= range.start && x.payedOn <= range.end)
    .reduce((acc, curr) => acc + curr.value, 0);
};
