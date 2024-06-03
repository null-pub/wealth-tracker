import { Store } from "./store";

export const getDefaultStore = (): Store => ({
  version: 4,
  projectedIncome: {
    timeSeries: {
      paycheck: [],
      meritBonusPct: [],
      companyBonusPct: [
        {
          date: "2014-06-15T00:00:00.000-07:00",
          value: 0.248,
        },
        {
          date: "2015-06-15T00:00:00.000-07:00",
          value: 0.248,
        },
        {
          date: "2016-06-15T00:00:00.000-07:00",
          value: 0.204,
        },
        {
          date: "2017-06-15T00:00:00.000-07:00",
          value: 0.22,
        },
        {
          date: "2018-06-15T00:00:00.000-07:00",
          value: 0.26,
        },
        {
          date: "2019-06-15T00:00:00.000-07:00",
          value: 0.242,
        },
        {
          date: "2020-06-15T00:00:00.000-07:00",
          value: 0.219,
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
        {
          date: "2024-06-15T00:00:00.000-07:00",
          value: 0.2075,
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
    bonusWithholdingsRate: 0,
  },
});
