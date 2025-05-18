import { z } from "zod";
import { wealth } from "../version-5/net-wealth";
import { projectedWealth } from "../version-6/projected-wealth";
import { projectedIncome } from "./projected-income";

export const storeValidator = z.object({
  version: z.literal(8),
  wealth: wealth,
  projectedIncome: projectedIncome,
  projectedWealth: projectedWealth,
});

export type Store = z.infer<typeof storeValidator>;
