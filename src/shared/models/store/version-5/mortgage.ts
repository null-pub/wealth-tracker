import { z } from "zod";
import { loanValidator } from "../version-2";
import { accountDataValidator } from "../version-3/account-data";

export const mortgageValidator = z.object({
  type: z.literal("mortgage"),
  loan: loanValidator.optional(),
  data: z.array(accountDataValidator),
  hidden: z.boolean().default(false),
});

export type Mortgage = z.infer<typeof mortgageValidator>;
