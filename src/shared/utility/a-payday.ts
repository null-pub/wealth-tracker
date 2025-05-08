import { DateTime } from "luxon";

/**
 * A reference payday used to align pay periods
 * This constant defines a known payday that helps in calculating biweekly pay schedules
 * Any payday can be used as a reference since we only need it to determine the pattern
 *
 * @constant {DateTime}
 */
export const aPayday = DateTime.fromObject({ month: 12, day: 1, year: 2023 });
