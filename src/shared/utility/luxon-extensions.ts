import { DateTime } from "luxon";

declare module "luxon" {
  interface DateTime {
    /**
     * Type guard that ensures a DateTime is valid. Throws an error if the date is invalid.
     *
     * @throws {Error} If the date is invalid with the invalidReason as the message
     * @returns {DateTime<true>} This date cast as a valid DateTime
     * @example
     * const validDate = DateTime.local().toValid();
     * const invalidDate = DateTime.fromISO("invalid");
     * try {
     *   invalidDate.toValid(); // Throws error: Invalid date: unparseable
     * } catch (e) {
     *   console.error(e);
     * }
     */
    toValid(): DateTime<true>;
  }
}

DateTime.prototype.toValid = function (this: DateTime): DateTime<true> {
  if (!this.isValid) {
    throw new Error(`Invalid date: ${this.invalidReason}`);
  }
  return this as DateTime<true>;
};
