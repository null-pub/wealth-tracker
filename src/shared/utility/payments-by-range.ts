import { DateTime } from "luxon";
import { PaymentPeriod, PaymentType } from "shared/models/payment-periods";

/**
 * Filters payment periods by type and date range
 * Used to get relevant payments that fall within a specific timeframe and match specific payment types
 *
 * @param {PaymentType[]} types - Array of payment types to filter by
 * @param {Object} range - The date range to filter within
 * @param {DateTime} range.start - Start date of the range
 * @param {DateTime} range.end - End date of the range
 * @param {PaymentPeriod[]} payments - Array of all payment periods to filter
 * @returns {PaymentPeriod[]} Array of payment periods that match the types and fall within the range
 * @example
 * const payments = paymentsByRange(
 *   [PaymentTypes.regular, PaymentTypes.bonus],
 *   { start: DateTime.fromISO('2025-01-01'), end: DateTime.fromISO('2025-12-31') },
 *   allPayments
 * );
 */
export const paymentsByRange = (types: PaymentType[], range: { start: DateTime; end: DateTime }, payments: PaymentPeriod[]) => {
  return payments.filter((x) => {
    const payedOn = DateTime.fromISO(x.payedOn);
    return types.includes(x.type) && payedOn >= range.start && payedOn <= range.end;
  });
};
