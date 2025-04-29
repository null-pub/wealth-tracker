import { DateTime } from "luxon";

export const getLocalDateTime = () => {
  const date = DateTime.local();
  return date;
};

export const useLocalDateTime = () => {
  const date = DateTime.local();
  return date;
};
