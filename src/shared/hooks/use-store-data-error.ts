import { storeValidator } from "shared/models/store/current";

export const useStoreDataError = () => {
  const invalidData = localStorage.getItem("store-invalid");

  if (!invalidData) {
    return { hadError: false };
  }

  const jsonInvalidData = JSON.parse(invalidData);
  const validated = storeValidator.safeParse(jsonInvalidData);

  return {
    hadError: !!invalidData,
    invalidData: jsonInvalidData,
    parseError: invalidData && !validated.success ? validated.error : undefined,
    resetError: () => {
      localStorage.removeItem("store-invalid");
    },
  };
};
