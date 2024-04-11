import { Box } from "@mui/system";
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
//(max ?? 0) - (min ?? 0) < 1000
export const CashRange = ({ min, max, fallback, disableTooltip, compact = true }: CashProps) => {
  return (
    <Box>
      {(max ?? 0) / (min ?? 1) <= 1.01 && (
        <Cash fallback={fallback} value={max} disableTooltip={disableTooltip} compact={compact} />
      )}
      {(max ?? 0) / (min ?? 1) > 1.01 && (
        <>
          <Cash value={min} fallback={fallback} disableTooltip={disableTooltip} compact={compact} />
          <span> - </span>
          <Cash value={max} fallback={fallback} disableTooltip={disableTooltip} compact={compact} />
        </>
      )}
    </Box>
  );
};
