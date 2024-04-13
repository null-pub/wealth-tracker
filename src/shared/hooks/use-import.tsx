import { useCallback } from "react";
import { storeValidator } from "shared/models/store/current";
import { store } from "shared/store";
import { migration } from "shared/store/migrations";

function selectFile(contentType: string) {
  return new Promise<File>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = contentType;

    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      resolve(files[0]);
    };

    input.click();
  });
}

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
