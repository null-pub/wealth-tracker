import { z } from "zod";
import { wealth } from "./net-wealth";
import { projectedIncome } from "./projected-income";
import { projectedWealth } from "./projected-wealth";

export const getDefaultStore = (): Store => ({
  projectedIncome: {
    timeSeries: {
      paycheck: [],
      meritBonusPct: [],
      companyBonusPct: [
        {
          date: "2020-06-15T00:00:00.000-07:00",
          value: 0.182,
          id: "a52883a7-008b-4b5d-83f7-48bb72a90f27",
        },
        {
          date: "2021-06-15T00:00:00.000-07:00",
          value: 0.254,
          id: "ec5a9913-d2ea-45cf-bbe4-4a28bc3a02eb",
        },
        {
          date: "2022-06-15T00:00:00.000-07:00",
          value: 0.272,
          id: "45f44fc7-544a-4652-87fa-49d70eaa412d",
        },
        {
          date: "2023-06-15T00:00:00.000-07:00",
          value: 0.168,
          id: "97af5146-6a4d-466d-8b9e-96552fc70639",
        },
      ],
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
