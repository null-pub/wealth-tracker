import { z } from "zod";

export const accountDataValidator = z.object({
  date: z.string(),
  value: z.number(),
  id: z.string(),
});

export type AccountData = z.infer<typeof accountDataValidator>;
