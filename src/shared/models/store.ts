import { z } from "zod";
import { wealth } from "./net-wealth";
import { projectedIncome } from "./projected-income";
import { projectedWealth } from "./projected-wealth";

export const getDefaultStore = (): Store => ({
  projectedIncome: {
    timeSeries: {
      paycheck: [],
      meritBonusPct: [],
      companyBonusPct: [],
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      equityPct: [],
      meritIncreasePct: [],
    },
  },
  wealth: {},
  projectedWealth: {
    medicareSupplementalTaxThreshold: 200_000,
    socialSecurityLimit: 168_600,
    socialSecurityTaxRate: 0.062,
    medicareSupplementalTaxRate: 0.009,
    savingsPerMonth: 0,
    retirementContributionPaycheck: 0,
  },
});

export const storeValidator = z.object({
  wealth: wealth,
  projectedIncome: projectedIncome,
  projectedWealth: projectedWealth,
});

export type Store = z.infer<typeof storeValidator>;
