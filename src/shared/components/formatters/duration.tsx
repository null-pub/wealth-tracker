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
export const Duration = (props: DurationProps) => {
  const { dateTime, children, variant = "countdown", dateFormat = shortDate } = props;

  const countDownStr = useMemo(() => {
    if (!dateTime) {
      return "??";
    }
    if (variant === "countdown") {
      const diff = dateTime?.diffNow(["months", "days", "hours"]);
      if (diff.months > 0) {
        return diff?.toFormat("M'm'");
      }
      if (diff.days > 0) {
        return diff?.toFormat("d'd'");
      }
      return diff?.toFormat("h'hr'");
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
