import { z } from "zod";

export const accountDataValidator = z.object({
  date: z.string(),
  value: z.number(),
});

export type AccountData = z.infer<typeof accountDataValidator>;
