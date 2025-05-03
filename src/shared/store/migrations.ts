import { MONTHS_PER_YEAR, PAYMENTS_PER_YEAR } from "shared/constants";
import { storeValidator } from "shared/models/store/current";
import { storeValidator as storeV0Validator } from "shared/models/store/version-0";
import { Store as StoreV1, storeValidator as storeV1Validator } from "shared/models/store/version-1";
import { Store as StoreV2, storeValidator as storeV2Validator } from "shared/models/store/version-2";
import { Store as StoreV3, storeValidator as storeV3Validator } from "shared/models/store/version-3";
import { Store as StoreV4, storeValidator as storeV4Validator } from "shared/models/store/version-4";
import { Store as StoreV5, storeValidator as storeV5Validator } from "shared/models/store/version-5";
import { Store as StoreV6 } from "shared/models/store/version-6";

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
      (data as StoreV3).version = 3;
    }
    if (data.version === 3) {
      storeV3Validator.parse(data);
      (data as StoreV4).version = 4;
      (data as StoreV4).projectedWealth.bonusWithholdingsRate = (data as StoreV3).projectedWealth.bonusWitholdingsRate;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data as any).projectedWealth.bonusWitholdingsRate;
    }
    if (data.version === 4) {
      storeV4Validator.parse(data);
      (data as StoreV5).version = 5;
      const keys = Object.keys((data as StoreV5).wealth);
      for (let i = 0; i < keys.length; i++) {
        (data as StoreV5).wealth[keys[i]].hidden = false;
      }
    }
    if (data.version === 5) {
      storeV5Validator.parse(data);
      (data as StoreV6).version = 6;
      (data as StoreV6).projectedWealth.savingsPerPaycheck =
        (data as StoreV5).projectedWealth.savingsPerMonth * (MONTHS_PER_YEAR / PAYMENTS_PER_YEAR);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data as any).projectedWealth.savingsPerMonth;
    }
  }

  const next = storeValidator.parse(data);
  console.log(next);
  return next;
};
