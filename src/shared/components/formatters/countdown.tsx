import { Box, Tooltip } from "@mui/material";
import { DateTime } from "luxon";
import { ReactNode } from "react";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";
import { toHuman } from "shared/utility/to-human";

type Variant = "countdown" | "date";

interface DurationProps {
  dateTime?: DateTime;
  children?: ReactNode;
  variant?: Variant;
  dateFormat?: string;
}

export const CountDown = (props: DurationProps) => {
  const { dateTime, children, variant = "countdown", dateFormat = shortDate } = props;

  const countDownStr = useCountdownText(variant, dateTime, dateFormat);
  const tooltipStr = useTooltipText(variant, dateTime, dateFormat);
  const countDownColor = useCountDownColor(dateTime);

  return dateTime && dateTime > getLocalDateTime() ? (
    <Tooltip title={tooltipStr}>
      <Box color={countDownColor}>{countDownStr}</Box>
    </Tooltip>
  ) : (
    children
  );
};

const useTooltipText = (variant: Variant, dateTime: DateTime | undefined, dateFormat: string) => {
  if (!dateTime) {
    return "??";
  }

  if (variant === "countdown") {
    return dateTime?.toFormat(dateFormat);
  }
  const diff = dateTime?.diff(getLocalDateTime(), ["years", "months", "days", "hours"]);

  return toHuman(diff, "days");
};

const useCountdownText = (variant: Variant, dateTime: DateTime | undefined, dateFormat: string) => {
  if (!dateTime) {
    return "??";
  }

  if (variant === "countdown") {
    const diff = dateTime?.diff(getLocalDateTime(), ["years", "months", "days", "hours"]);

    return toHuman(diff, "days");
  }

  return dateTime?.toFormat(dateFormat);
};

const useCountDownColor = (dateTime?: DateTime) => {
  if (!dateTime) {
    return "white";
  }

  const days = dateTime.diffNow("days").days;
  if (days < 30) {
    return "green";
  } else if (days <= 60) {
    return "orange";
  }

  return "rgb(244, 67, 54)";
};
