import { InputAdornment, TextField } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { useCallback, useState } from "react";
import { ProjectedWealthKeys } from "shared/models/store/current";
import { store } from "shared/store";
import { setProjectedWealth } from "shared/store/set-projected-wealth";

interface ConfigEntryProps {
  configName: ProjectedWealthKeys;
  label: string;
  variant?: "cash" | "percent";
}

export const ConfigEntry = (props: ConfigEntryProps) => {
  const { configName, label, variant = "cash" } = props;
  const [error, setError] = useState(false);
  const isPercent = variant === "percent";

  const onchange = useCallback(
    (input: string) => {
      let value = +input;
      const isNan = Number.isNaN(value);
      setError(isNan);
      if (isNan) {
        return;
      }

      if (isPercent) {
        value /= 100;
      }

      setProjectedWealth(configName, value);
    },
    [configName, isPercent]
  );

  const value = useStore(store, (x) => x.projectedWealth[configName]);
  const defaultValue = isPercent ? value * 100 : value;

  return (
    <TextField
      error={error}
      variant="outlined"
      InputProps={{
        startAdornment: <InputAdornment position="start">{isPercent ? "%" : "$"}</InputAdornment>,
      }}
      defaultValue={defaultValue.toFixed(isPercent ? 2 : 0)}
      type="numeric"
      label={label}
      onChange={(event) => {
        onchange(event.target.value);
      }}
    />
  );
};
