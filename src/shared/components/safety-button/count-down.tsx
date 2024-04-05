import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";

export const CountDown = (props: { timeMs: number }) => {
  const { timeMs } = props;
  const [time, setTime] = useState(timeMs);

  useEffect(() => {
    const intervalMs = 100;
    const interval = setInterval(() => {
      setTime((prev) => {
        const remaining = prev - intervalMs;
        if (remaining < 0) {
          clearInterval(interval);
          return 0;
        }
        return remaining;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [props.timeMs]);

  return <LinearProgress value={(time / timeMs) * 100} variant="determinate" color="inherit" />;
};
