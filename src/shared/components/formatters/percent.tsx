import { Box } from "@mui/system";
import { ReactNode } from "react";
import { formatPercent } from "shared/utility/format-percent";
import { getProbablityColor } from "shared/utility/get-probablity-color";

interface PercentProps {
  value?: number;
  probability?: number;
  fallback?: ReactNode;
}

export const Percent = ({ value, probability, fallback }: PercentProps) => {
  return <Box color={getProbablityColor(probability)}>{value != undefined ? formatPercent(value) : fallback}</Box>;
};
