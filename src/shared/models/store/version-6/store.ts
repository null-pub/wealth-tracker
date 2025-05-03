import { z } from "zod";
import { projectedIncome } from "../version-3/projected-income";
import { wealth } from "../version-5/net-wealth";
import { projectedWealth } from "./projected-wealth";

export const storeValidator = z.object({
  version: z.literal(6),
  wealth: wealth,
  projectedIncome: projectedIncome,
  projectedWealth: projectedWealth,
});

export type Store = z.infer<typeof storeValidator>;
