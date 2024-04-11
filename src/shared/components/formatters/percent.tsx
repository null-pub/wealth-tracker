import { Box } from "@mui/system";
import { formatPercent } from "shared/utility/format-percent";

interface PercentProps {
  value: number;
  probability?: number;
}

const getColor = (probability?: number) => {
  if (!probability) {
    return "inherit";
  }
  if (probability >= 0.5) {
    return "green";
  }
  if (probability >= 0.3) {
    return "yellow";
  }
  return "red";
};

export const Percent = ({ value, probability }: PercentProps) => {
  return <Box color={getColor(probability)}>{formatPercent(value)}</Box>;
};
