import { Box, Tooltip } from "@mui/material";
import { DateTime } from "luxon";
import { ReactNode, useMemo } from "react";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";
import { toHuman } from "shared/utility/to-human";

interface DurationProps {
  dateTime?: DateTime;
  children?: ReactNode;
  variant?: "countdown" | "date";
  dateFormat?: string;
}
export const CountDown = (props: DurationProps) => {
  const { dateTime, children, variant = "countdown", dateFormat = shortDate } = props;

  const countDownStr = useMemo(() => {
    if (!dateTime) {
      return "??";
    }
    if (variant === "countdown") {
      const diff = dateTime?.diff(getLocalDateTime(), ["years", "months", "days", "hours"]);

      return toHuman(diff, "days");
    }

    return dateTime?.toFormat(dateFormat);
  }, [dateFormat, dateTime, variant]);

  const tooltipStr = useMemo(() => {
    if (!dateTime) {
      return "??";
    }

    if (variant === "countdown") {
      return dateTime?.toFormat(dateFormat);
    }
    const diff = dateTime?.diff(getLocalDateTime(), ["years", "months", "days", "hours"]);

    return toHuman(diff, "days");
  }, [dateFormat, dateTime, variant]);

  const countDownColor = useMemo(() => {
    if (!dateTime) {
      return "white";
    }

    const days = dateTime.diffNow("days").days;
    if (days < 30) {
      return "green";
    } else if (days <= 60) {
      return "orange";
    }

    return "red";
  }, [dateTime]);

  return dateTime && dateTime > getLocalDateTime() ? (
    <Tooltip title={tooltipStr}>
      <Box color={countDownColor}>{countDownStr}</Box>
    </Tooltip>
  ) : (
    children
  );
};
