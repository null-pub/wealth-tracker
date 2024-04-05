import { z } from "zod";
import { accountDataValidator } from "./account-data";

export const accountValidator = z.object({
  type: z.literal("account"),
  data: z.array(accountDataValidator),
});

export type Account = z.infer<typeof accountValidator>;
