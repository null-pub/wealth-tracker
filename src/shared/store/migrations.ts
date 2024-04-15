import { Store, storeValidator } from "shared/models/store/current";
import { storeValidator as storeV0Validator } from "shared/models/store/version-0";
import { Store as StoreV1, storeValidator as storeV1Validator } from "shared/models/store/version-1";
import { Store as StoreV2, storeValidator as storeV2Validator } from "shared/models/store/version-2";

export const migration = (data: unknown) => {
  if (data === null || data === undefined) {
    throw new Error("parsed data is null or undefined");
  } else if (typeof data !== "object") {
    throw new Error("Parsed data is not an object");
  }

  if (!("version" in data)) {
    storeV0Validator.parse(data);
    (data as StoreV1).version = 1;
  }

  if ("version" in data) {
    if (data.version === 1) {
      storeV1Validator.parse(data);
      (data as StoreV2).version = 2;
      (data as StoreV2).projectedWealth.bonusWitholdingsRate = 0;
    }
    if (data.version === 2) {
      storeV2Validator.parse(data);
      (data as Store).version = 3;
    }
  }

  return storeValidator.parse(data);
};
