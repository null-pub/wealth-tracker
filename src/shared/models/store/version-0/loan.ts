import { z } from "zod";

export const loanValidator = z.object({
  principal: z.number(),
  ratePct: z.number(),
  paymentsPerYear: z.number(),
  payment: z.number(),
  firstPaymentDate: z.string(),
  ownershipPct: z.number(),
});

export type Loan = z.infer<typeof loanValidator>;
