import { DateTime } from "luxon";
import { MONTHS_PER_YEAR, PAYMENTS_PER_YEAR } from "shared/constants";
import { storeValidator } from "shared/models/store/current";
import { storeValidator as storeV0Validator } from "shared/models/store/version-0";
import { Store as StoreV1, storeValidator as storeV1Validator } from "shared/models/store/version-1";
import { Store as StoreV2, storeValidator as storeV2Validator } from "shared/models/store/version-2";
import { Store as StoreV3, storeValidator as storeV3Validator } from "shared/models/store/version-3";
import { Store as StoreV4, storeValidator as storeV4Validator } from "shared/models/store/version-4";
import { Store as StoreV5, storeValidator as storeV5Validator } from "shared/models/store/version-5";
import { Store as StoreV6, storeValidator as storeV6Validator } from "shared/models/store/version-6";
import { MeritData, Store as StoreV7, storeValidator as storeV7Validator } from "shared/models/store/version-7";
import { Store as StoreV8, getDefaultStore as getDefaultStoreV8 } from "shared/models/store/version-8";
import { groupBySingle } from "shared/utility/group-by-single";

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
      const storeV5 = data as StoreV5;
      const storeV6 = data as StoreV6;
      storeV6.version = 6;
      storeV6.projectedWealth.savingsPerPaycheck = storeV5.projectedWealth.savingsPerMonth * (MONTHS_PER_YEAR / PAYMENTS_PER_YEAR);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data as any).projectedWealth.savingsPerMonth;
    }
    if (data.version === 6) {
      storeV6Validator.parse(data);
      const storeV7 = data as StoreV7;
      const storeV6 = data as StoreV6;
      storeV7.version = 7;
      storeV7.projectedIncome.timeSeries.meritPct = [];
      const { equityPct, meritBonusPct, meritIncreasePct } = storeV6.projectedIncome.timeSeries;

      const meritBonusPctByYear = groupBySingle(meritBonusPct, (x) => DateTime.fromISO(x.date).year);
      const equityPctByYear = groupBySingle(equityPct, (x) => DateTime.fromISO(x.date).year);

      storeV7.projectedIncome.timeSeries.meritPct = meritIncreasePct.map((x): MeritData => {
        const year = DateTime.fromISO(x.date).year;
        return {
          date: x.date,
          meritIncreasePct: x.value,
          equityPct: equityPctByYear[year]?.value ?? 0,
          meritBonusPct: meritBonusPctByYear[year]?.value ?? 0,
          enabled: true,
        };
      });
    }
    if (data.version === 7) {
      storeV7Validator.parse(data);
      const storeV8 = data as StoreV8;
      storeV8.version = 8;

      const defaultStore = getDefaultStoreV8();
      storeV8.projectedIncome.config = defaultStore.projectedIncome.config;
    }
  }

  const next = storeValidator.parse(data);
  console.log(next);
  return next;
};
