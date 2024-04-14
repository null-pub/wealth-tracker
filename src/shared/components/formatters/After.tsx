import { DateTime } from "luxon";
import { ReactNode } from "react";

interface BeforeAfterProps {
  dateTime?: DateTime;
  children?: ReactNode;
}

export const After = (props: BeforeAfterProps) => {
  const { dateTime, children } = props;

  if (!dateTime) {
    return null;
  }

  return DateTime.local() < dateTime && children;
};
