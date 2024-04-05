import { useStore } from "@tanstack/react-store";
import { useCallback } from "react";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";

export const downloadJson = <T,>(filename: string, storeData: T) => {
  const data = JSON.stringify(storeData, null, 2);
  const link = document.createElement("a");
  link.download = filename;
  const blob = new Blob([data], { type: "application/json" });
  link.href = window.URL.createObjectURL(blob);
  link.click();
};

export const useExport = () => {
  const storeData = useStore(store);
  const onExport = useCallback(() => {
    downloadJson(`wealth-tracker-${getLocalDateTime().toFormat(shortDate)}.json`, storeData);
  }, [storeData]);

  return onExport;
};
