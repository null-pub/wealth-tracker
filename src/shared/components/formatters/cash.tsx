import { Tooltip } from "@mui/material";
import { formatCash, formatCashShort } from "shared/utility/format-cash";

interface CashProps {
  value?: number;
  fallback?: number;
  disableTooltip?: boolean;
  compact?: boolean;
  tooltip?: string;
  placement?:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "bottom-end"
    | "bottom-start"
    | "left-end"
    | "left-start"
    | "right-end"
    | "right-start"
    | "top-end"
    | "top-start"
    | undefined;
}

const format = (value: number | undefined, compact: boolean, fallback: number | undefined) => {
  if (value === undefined) {
    return fallback;
  }
  return compact ? formatCashShort(value) : formatCash(value);
};

export const Cash = ({ value, fallback, disableTooltip, compact = true, tooltip, placement }: CashProps) => {
  const formatted = format(value, compact, fallback);

  return (
    <Tooltip
      placement={placement}
      disableHoverListener={disableTooltip || !compact || !value}
      title={[tooltip, formatCash(value!)].join(" ")}
    >
      <span>{formatted}</span>
    </Tooltip>
  );
};
