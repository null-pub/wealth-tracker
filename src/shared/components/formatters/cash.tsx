import { Tooltip } from "@mui/material";
import { useMemo } from "react";
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
export const Cash = ({ value, fallback, disableTooltip, compact = true, tooltip, placement }: CashProps) => {
  const formatted = useMemo(() => {
    if (value === undefined) {
      return fallback;
    }
    return compact ? formatCashShort(value) : formatCash(value);
  }, [compact, fallback, value]);

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
