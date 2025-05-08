import { DateTime } from "luxon";
import { PaymentPeriod, PaymentType } from "shared/models/payment-periods";
import { paymentsByRange } from "./payments-by-range";

/**
 * Calculates the total income for specified payment types within a date range
 *
 * @param {PaymentType[]} types - Array of payment types to include in the calculation
 * @param {Object} range - Date range to calculate income for
 * @param {DateTime} range.start - Start date of the range
 * @param {DateTime} range.end - End date of the range
 * @param {PaymentPeriod[]} pay - Array of payment periods to calculate from
 * @returns {number} Total income for the specified types within the date range
 */
export const incomeByRange = (types: PaymentType[], range: { start: DateTime; end: DateTime }, pay: PaymentPeriod[]) => {
  return paymentsByRange(types, range, pay).reduce((acc, curr) => acc + curr.value, 0);
};
