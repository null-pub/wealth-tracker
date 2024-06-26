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
    return "orange";
  }
  return "rgb(244, 67, 54)";
};

export const Percent = ({ value, probability, fallback }: PercentProps) => {
  return <Box color={getColor(probability)}>{value != undefined ? formatPercent(value) : fallback}</Box>;
};
