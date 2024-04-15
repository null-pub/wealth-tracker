import { Box, Tooltip } from "@mui/material";
import { DateTime } from "luxon";
import { ReactNode, useMemo } from "react";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";

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
      const format = `${diff.years > 0 ? "y 'years' " : ""}${diff.months > 0 ? "M 'months' " : ""}${
        diff.days > 0 && diff.months == 0 && diff.years === 0 ? "d 'days'" : ""
      }${diff.hours > 0 && diff.days === 0 && diff.months === 0 && diff.years === 0 ? "h 'hours'" : ""}`;

      return diff?.toFormat(format);
    }

    return dateTime?.toFormat(dateFormat);
  }, [dateFormat, dateTime, variant]);

  const tooltipStr = useMemo(() => {
    if (variant === "countdown") {
      return dateTime?.toFormat(dateFormat);
    }

    return dateTime?.diffNow(["months", "days", "hours"]).toFormat("d 'days'");
  }, [dateFormat, dateTime, variant]);

  const countDownColor = useMemo(() => {
    if (!dateTime) {
      return "white";
    }

    const days = dateTime.diffNow("days").days;
    if (days < 30) {
      return "green";
    } else if (days < 60) {
      return "yellow";
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
