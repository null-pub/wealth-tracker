import { z } from "zod";
import { accountDataValidator, meritData } from "./account-data";

export const projectedIncome = z.object({
  timeSeries: z.object({
    paycheck: z.array(accountDataValidator),
    meritPct: z.array(meritData),
    companyBonusPct: z.array(accountDataValidator),
    companyBonus: z.array(accountDataValidator),
    retirementBonus: z.array(accountDataValidator),
    meritBonus: z.array(accountDataValidator),
  }),
});

export type ProjectedIncome = z.infer<typeof projectedIncome>;
export type TimeSeries = ProjectedIncome["timeSeries"];
export type TimeSeriesKeys = Exclude<keyof ProjectedIncome["timeSeries"], "meritPct">;
export type TimeSeriesMeritKey = "meritPct";
