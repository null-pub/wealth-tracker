import { Box } from "@mui/material";
import { Value } from "capabilities/projected-income/components/value";
import { CashRange } from "shared/components/formatters/cash-range";
import { Percent } from "shared/components/formatters/percent";
import { PercentRange } from "shared/components/formatters/percent-range";

interface ClusterValueProps {
  min: number;
  max: number;
  probability: number;
  title: string;
  compact?: boolean;
}

export const ClusterValue = (props: ClusterValueProps) => {
  const { min, max, probability, title, compact } = props;
  return (
    <Value
      title={
        <Box display={"flex"} gap={1}>
          <span>{title}</span>
          {probability < 1 && <Percent probability={probability} value={probability} />}
        </Box>
      }
    >
      {min < 1 && min > 0 && <PercentRange min={min} max={max} />}
      {min > 1 && <CashRange compact={compact} min={min} max={max} />}
      {min === 0 && 0}
    </Value>
  );
};
