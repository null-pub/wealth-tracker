import { z } from "zod";
import { accountDataValidator } from "../version-3/account-data";

export const accountValidator = z.object({
  type: z.literal("account"),
  data: z.array(accountDataValidator),
  hidden: z.boolean().default(false),
});

export type Account = z.infer<typeof accountValidator>;
