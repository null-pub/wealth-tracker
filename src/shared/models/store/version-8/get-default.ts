import { Store } from "./store";

export const getDefaultStore = (): Store => ({
  version: 8,
  projectedIncome: {
    timeSeries: {
      paycheck: [],
      meritPct: [],
      companyBonusPct: [],
      companyBonus: [],
      retirementBonus: [],
      meritBonus: [],
    },
    config: {
      outstanding: {
        bonusPct: 0,
        meritIncreasePct: 0,
      },
      exceedsExpectations: {
        bonusPct: 0,
        meritIncreasePct: 0,
      },
      meetsExpectations: {
        bonusPct: 0,
        meritIncreasePct: 0,
      },
      didNotMeet: { bonusPct: 0, meritIncreasePct: 0 },
    },
  },
  wealth: {},
  projectedWealth: {
    medicareSupplementalTaxThreshold: 200_000,
    socialSecurityLimit: 168_600,
    socialSecurityTaxRate: 0.062,
    medicareSupplementalTaxRate: 0.009,
    savingsPerPaycheck: 0,
    retirementContributionPaycheck: 0,
    bonusWithholdingsRate: 0,
  },
});
