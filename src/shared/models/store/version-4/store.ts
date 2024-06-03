import { z } from "zod";
import { wealth } from "../version-3/net-wealth";
import { projectedIncome } from "../version-3/projected-income";
import { projectedWealth } from "./projected-wealth";

export const storeValidator = z.object({
  version: z.literal(4),
  wealth: wealth,
  projectedIncome: projectedIncome,
  projectedWealth: projectedWealth,
});

export type Store = z.infer<typeof storeValidator>;
