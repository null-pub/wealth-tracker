import { storeValidator } from "shared/models/store/current";

/**
 * React hook that handles store data validation errors
 *
 * @returns {Object} Object containing:
 * - hadError: boolean indicating if there was a validation error
 * - invalidData: The invalid data that failed validation (if any)
 * - parseError: The validation error details (if any)
 * - resetError: Function to clear the error state
 */
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
