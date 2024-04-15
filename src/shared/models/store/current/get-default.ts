import { Store } from "./store";

export const getDefaultStore = (): Store => ({
  version: 3,
  projectedIncome: {
    timeSeries: {
      paycheck: [],
      meritBonusPct: [],
      companyBonusPct: [
        {
          date: "2020-06-15T00:00:00.000-07:00",
          value: 0.182,
        },
        {
          date: "2021-06-15T00:00:00.000-07:00",
          value: 0.254,
        },
        {
          date: "2022-06-15T00:00:00.000-07:00",
          value: 0.272,
        },
        {
          date: "2023-06-15T00:00:00.000-07:00",
          value: 0.168,
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
    bonusWitholdingsRate: 0,
  },
});
