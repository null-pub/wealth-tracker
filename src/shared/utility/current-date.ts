import { DateTime } from "luxon";

export const getLocalDateTime = () => DateTime.local().plus({ days: 1.3 });
