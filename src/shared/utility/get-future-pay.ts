import { DateTime } from "luxon";
import { AccountData } from "shared/models/store/current";

/**
 * Calculates future pay amounts based on merit increases and equity adjustments
 * Projects pay forward using historical data and merit/equity increase percentages
 *
 * @param {AccountData[]} pay - Historical pay data
 * @param {AccountData} mostRecentPay - Most recent pay data point
 * @param {number[]} meritIncreasePcts - Array of merit increase percentages to apply
 * @param {DateTime} meritIncrease - Date when merit increases take effect
 * @param {number} year - Target year for projections
 * @param {Partial<Record<number, AccountData>>} equityLookup - Lookup of equity adjustments by year
 * @returns {AccountData[]} Array of projected pay data
 */
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
