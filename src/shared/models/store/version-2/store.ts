import { z } from "zod";
import { projectedIncome, wealth } from "../version-1";
import { projectedWealth } from "./projected-wealth";

export const storeValidator = z.object({
  version: z.literal(2),
  wealth: wealth,
  projectedIncome: projectedIncome,
  projectedWealth: projectedWealth,
});

export type Store = z.infer<typeof storeValidator>;
