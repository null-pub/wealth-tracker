import { z } from "zod";
import { wealth } from "../version-0/net-wealth";
import { projectedIncome } from "../version-0/projected-income";
import { projectedWealth } from "../version-0/projected-wealth";

export const storeValidator = z.object({
  version: z.literal(1),
  wealth: wealth,
  projectedIncome: projectedIncome,
  projectedWealth: projectedWealth,
});

export type Store = z.infer<typeof storeValidator>;
