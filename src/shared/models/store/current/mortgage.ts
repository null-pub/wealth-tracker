import { z } from "zod";
import { loanValidator } from "../version-2";
import { accountDataValidator } from "./account-data";

export const mortgageValidator = z.object({
  type: z.literal("mortgage"),
  loan: loanValidator.optional(),
  data: z.array(accountDataValidator),
});

export type Mortgage = z.infer<typeof mortgageValidator>;
