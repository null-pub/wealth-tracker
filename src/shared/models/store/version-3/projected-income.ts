import { z } from "zod";
import { accountDataValidator } from "./account-data";

export const projectedIncome = z.object({
  timeSeries: z.object({
    paycheck: z.array(accountDataValidator),
    meritIncreasePct: z.array(accountDataValidator),
    equityPct: z.array(accountDataValidator),
    meritBonusPct: z.array(accountDataValidator),
    meritBonus: z.array(accountDataValidator),
    companyBonusPct: z.array(accountDataValidator),
    companyBonus: z.array(accountDataValidator),
    retirementBonus: z.array(accountDataValidator),
  }),
});

export type ProjectedIncome = z.infer<typeof projectedIncome>;
export type TimeSeries = keyof ProjectedIncome["timeSeries"];
