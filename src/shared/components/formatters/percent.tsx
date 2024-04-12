import { Box } from "@mui/system";
import { ReactNode } from "react";
import { formatPercent } from "shared/utility/format-percent";

interface PercentProps {
  value?: number;
  probability?: number;
  fallback?: ReactNode;
}

const getColor = (probability?: number) => {
  if (!probability) {
    return "inherit";
  }
  if (probability >= 0.5) {
    return "green";
  }
  if (probability >= 0.25) {
    return "yellow";
  }
  return "red";
};

export const Percent = ({ value, probability, fallback }: PercentProps) => {
  return <Box color={getColor(probability)}>{value ? formatPercent(value) : fallback}</Box>;
};
