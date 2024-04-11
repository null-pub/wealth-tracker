import { Box } from "@mui/system";
import { Percent } from "./percent";

interface PercentProps {
  min?: number;
  max?: number;
  fallback?: number;
}

export const PercentRange = ({ min, max, fallback }: PercentProps) => {
  return (
    <Box>
      {(max ?? 0) / (min ?? 1) <= 1.005 && <Percent fallback={fallback} value={max} />}
      {(max ?? 0) / (min ?? 1) > 1.005 && (
        <>
          <Percent value={min} fallback={fallback} />
          <span> - </span>
          <Percent value={max} fallback={fallback} />
        </>
      )}
    </Box>
  );
};
