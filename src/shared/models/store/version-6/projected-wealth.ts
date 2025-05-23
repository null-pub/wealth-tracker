import { z } from "zod";

export const projectedWealth = z.object({
  socialSecurityLimit: z.number(),
  socialSecurityTaxRate: z.number(),
  medicareSupplementalTaxThreshold: z.number(),
  medicareSupplementalTaxRate: z.number(),
  savingsPerPaycheck: z.number(),
  retirementContributionPaycheck: z.number(),
  bonusWithholdingsRate: z.number(),
});

export type ProjectedWealth = z.infer<typeof projectedWealth>;
export type ProjectedWealthKeys = keyof ProjectedWealth;
