import { DateTime } from "luxon";
import { ReactNode } from "react";

interface UntilProps {
  dateTime?: DateTime;
  children: ReactNode;
}

export const Until = (props: UntilProps) => {
  const { dateTime, children } = props;
  return dateTime && DateTime.local() < dateTime && children;
};
