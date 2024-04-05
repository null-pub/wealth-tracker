import { Box, Button, ButtonProps, Stack } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { CountDown } from "./count-down";

type SafetyState = "inactive" | "activating" | "active" | "confirmed";

interface SafetyButtonProps {
  inactiveLabel: string;
  activatingLabel: string;
  activeLabel: string;
  confirmedLabel: string;
  icon?: ReactNode;
  onConfirm: () => void;
}

export const SafetyButton = (props: Omit<ButtonProps, "children"> & SafetyButtonProps) => {
  const { inactiveLabel, activatingLabel, activeLabel, confirmedLabel, onConfirm, icon, disabled, ...rest } = props;
  const [safetyState, setSafetyState] = useState<SafetyState>("inactive");

  useEffect(() => {
    if (safetyState === "active") {
      setTimeout(() => {
        setSafetyState((prev) => {
          return prev === "active" ? "inactive" : prev;
        });
      }, 3200);
    } else if (safetyState === "activating") {
      setTimeout(() => {
        setSafetyState("active");
      }, 1000);
    } else if (safetyState === "confirmed") {
      setTimeout(() => {
        setSafetyState("inactive");
      }, 3200);
    }
  }, [safetyState]);

  return (
    <Box
      sx={{
        minWidth: 130,
      }}
    >
      <Button
        {...rest}
        sx={{ height: "100%", width: "100%" }}
        disabled={disabled || safetyState === "activating" || safetyState === "confirmed"}
        size="small"
        onClick={() => {
          safetyState === "inactive" && setSafetyState("activating");
          if (safetyState === "active") {
            onConfirm?.();
            setSafetyState("confirmed");
          }
        }}
      >
        <Stack>
          <Stack direction={"row"}>
            {icon}
            {safetyState === "inactive" && inactiveLabel}
            {safetyState === "activating" && activatingLabel}
            {safetyState === "active" && activeLabel}
            {safetyState === "confirmed" && confirmedLabel}
          </Stack>
          {safetyState === "active" && <CountDown timeMs={2800} />}
          {safetyState === "activating" && <CountDown timeMs={500} />}
        </Stack>
      </Button>
    </Box>
  );
};
