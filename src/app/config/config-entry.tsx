import { InputAdornment, TextField } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { useCallback, useState } from "react";
import { Store } from "shared/models/store/current";
import { store } from "shared/store";

interface ConfigEntryProps {
  getStore: (store: Store) => number;
  setStore: (value: number) => void;
  label: string;
  variant?: "cash" | "percent";
}

export const ConfigEntry = (props: ConfigEntryProps) => {
  const { label, variant = "cash", getStore, setStore } = props;
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

      setStore(value);
    },
    [isPercent, setStore]
  );

  const value = useStore(store, getStore);
  const defaultValue = isPercent ? value * 100 : value;

  return (
    <TextField
      error={error}
      variant="outlined"
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">{isPercent ? "%" : "$"}</InputAdornment>,
        },
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
