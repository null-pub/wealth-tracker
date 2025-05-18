import { z } from "zod";
import { accountDataValidator, meritData } from "../version-7";

export const projectedIncome = z.object({
  timeSeries: z.object({
    paycheck: z.array(accountDataValidator),
    meritPct: z.array(meritData),
    companyBonusPct: z.array(accountDataValidator),
    companyBonus: z.array(accountDataValidator),
    retirementBonus: z.array(accountDataValidator),
    meritBonus: z.array(accountDataValidator),
  }),
  config: z.object({
    didNotMeet: z.object({
      meritIncreasePct: z.number().optional(),
      bonusPct: z.number().optional(),
    }),
    meetsExpectations: z.object({
      meritIncreasePct: z.number().optional(),
      bonusPct: z.number().optional(),
    }),
    exceedsExpectations: z.object({
      meritIncreasePct: z.number().optional(),
      bonusPct: z.number().optional(),
    }),
    outstanding: z.object({
      meritIncreasePct: z.number().optional(),
      bonusPct: z.number().optional(),
    }),
  }),
});

export type ProjectedIncome = z.infer<typeof projectedIncome>;
export type TimeSeries = ProjectedIncome["timeSeries"];
export type TimeSeriesKeys = Exclude<keyof ProjectedIncome["timeSeries"], "meritPct">;
export type TimeSeriesMeritKey = "meritPct";
export type PerformanceConfig = ProjectedIncome["config"];
export type Ratings = keyof ProjectedIncome["config"];

export type RatingConfig = { mermeritIncreasePct: number; bonusPct: number };
