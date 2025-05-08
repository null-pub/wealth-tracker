import { useCallback } from "react";
import { storeValidator } from "shared/models/store/current";
import { store } from "shared/store";
import { migration } from "shared/store/migrations";

/**
 * Opens a file selection dialog and returns a Promise that resolves with the selected file
 *
 * @param {string} contentType - The MIME type filter for the file selection dialog
 * @returns {Promise<File>} A promise that resolves with the selected file
 */
function selectFile(contentType: string) {
  return new Promise<File>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = contentType;
    input.onchange = () => {
      if (input.files?.length) {
        resolve(input.files[0]);
      }
    };
    input.click();
  });
}

/**
 * React hook that provides functionality to import store data from a JSON file
 *
 * @returns {() => Promise<void>} A callback function that prompts for file selection and imports the data.
 * The Promise resolves when the import is successful or rejects with validation errors.
 */
export const useImport = () => {
  return useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      selectFile("application/json").then((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (readerEvent) => {
          const content = readerEvent.target?.result?.toString();
          if (content) {
            const data = JSON.parse(window.atob(content.split(",")[1]));
            const validation = storeValidator.safeParse(data);
            if (validation.success) {
              store.setState(() => data);
              resolve();
            } else {
              try {
                migration(data);
                store.setState(() => data);
                resolve();
              } catch (err) {
                console.log("error", err);
                console.log("invalid data", data);
                reject(err);
              }
            }
          }
        };
      });
    });
  }, []);
};
