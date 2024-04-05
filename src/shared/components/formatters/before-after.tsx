import { DateTime } from "luxon";
import { ReactNode } from "react";

interface BeforeAfterProps {
  dateTime?: DateTime;
  before?: ReactNode;
  after?: ReactNode;
}

export const BeforeAfter = (props: BeforeAfterProps) => {
  const { dateTime, before, after } = props;

  if (!dateTime) {
    return null;
  }

  return DateTime.local() < dateTime ? before : after;
};
