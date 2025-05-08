import { useStore } from "@tanstack/react-store";
import { useCallback } from "react";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { shortDate } from "shared/utility/format-date";

/**
 * Downloads the provided data as a JSON file with the given filename
 *
 * @template T - The type of data being downloaded
 * @param {string} filename - The name to give the downloaded file
 * @param {T} storeData - The data to be stringified and downloaded
 */
export const downloadJson = <T,>(filename: string, storeData: T) => {
  const data = JSON.stringify(storeData, null, 2);
  const link = document.createElement("a");
  link.download = filename;
  const blob = new Blob([data], { type: "application/json" });
  link.href = window.URL.createObjectURL(blob);
  link.click();
};

/**
 * React hook that provides functionality to export the current store data
 *
 * @returns {() => void} A callback function that triggers the download of store data as JSON
 */
export const useExport = () => {
  const storeData = useStore(store);
  const onExport = useCallback(() => {
    downloadJson(`wealth-tracker-${getLocalDateTime().toFormat(shortDate)}.json`, storeData);
  }, [storeData]);

  return onExport;
};
