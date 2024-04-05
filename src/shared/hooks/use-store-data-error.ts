import { useMemo } from "react";
import { storeValidator } from "shared/models/store";

export const useStoreDataError = () => {
  const invalidData = localStorage.getItem("store-invalid");
  return useMemo(() => {
    if (!invalidData) {
      return { hadError: false };
    }
    const validated = storeValidator.safeParse(JSON.parse(invalidData));
    return {
      hadError: !!invalidData,
      invalidData: JSON.stringify(invalidData, null, 2),
      parseError: invalidData && !validated.success ? validated.error : undefined,
      resetError: () => {
        localStorage.removeItem("store-invalid");
      },
    };
  }, [invalidData]);
};
