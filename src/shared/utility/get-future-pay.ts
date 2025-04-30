import { DateTime } from "luxon";
import { AccountData } from "shared/models/store/current";

export function getFuturePay(
  pay: AccountData[],
  mostRecentPay: AccountData,
  meritIncreasePcts: number[],
  meritIncrease: DateTime,
  year: number,
  equityLookup: Partial<Record<number, AccountData>>
) {
  const nextPay = pay.slice();
  const initial = nextPay.length;

  for (let i = initial; i < meritIncreasePcts.length + initial; i++) {
    const prior = nextPay[i - 1] ?? mostRecentPay;
    const date = DateTime.fromISO(prior.date ?? mostRecentPay?.date)
      .plus({ years: 1 })
      .set({ month: meritIncrease.month, day: meritIncrease.day });

    if (date.year > year) {
      break;
    }
    const equity = equityLookup[date.year]?.value ?? 0;
    nextPay.push({
      date: date.toISO()!,
      value: prior.value * (1 + meritIncreasePcts[i - initial] + equity),
    });
  }
  return nextPay;
}
