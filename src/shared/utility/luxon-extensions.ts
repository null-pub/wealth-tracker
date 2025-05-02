import { DateTime } from "luxon";

declare module "luxon" {
  interface DateTime {
    /**
     * Type guard function that ensures a DateTime is valid.
     * @throws Error if the date is invalid
     * @returns this date as DateTime<true>
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
