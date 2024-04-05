import { formatPercent } from "shared/utility/format-percent";

interface PercentProps {
  value: number;
}
export const Percent = ({ value }: PercentProps) => {
  return formatPercent(value);
};
