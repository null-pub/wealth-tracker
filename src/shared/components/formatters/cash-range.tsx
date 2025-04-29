import { Box } from "@mui/system";
import { formatCash, formatCashShort } from "shared/utility/format-cash";
import { Cash } from "./cash";

interface CashProps {
  min?: number;
  max?: number;
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
export const CashRange = ({ min, max, fallback, disableTooltip, compact = true }: CashProps) => {
  const minFormatted = compact ? formatCashShort(min ?? 0) : formatCash(min ?? 0);
  const maxFormatted = compact ? formatCashShort(max ?? 0) : formatCash(max ?? 0);
  const showRange = minFormatted !== maxFormatted;

  return (
    <Box>
      {!showRange && (
        <Cash
          fallback={fallback}
          value={max}
          tooltip={min != max ? `${formatCash(min ?? 0)} - ` : undefined}
          disableTooltip={disableTooltip}
          compact={compact}
        />
      )}
      {showRange && (
        <>
          <Cash value={min} fallback={fallback} disableTooltip={disableTooltip} compact={compact} />
          <span> - </span>
          <Cash value={max} fallback={fallback} disableTooltip={disableTooltip} compact={compact} />
        </>
      )}
    </Box>
  );
};
