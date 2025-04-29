import { DateTime } from "luxon";

export const getLocalDateTime = () => {
  const date = DateTime.local();
  return date;
};
