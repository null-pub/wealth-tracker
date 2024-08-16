import { z } from "zod";
import { projectedIncome } from "../version-3/projected-income";
import { projectedWealth } from "../version-4/projected-wealth";
import { wealth } from "./net-wealth";

export const storeValidator = z.object({
  version: z.literal(5),
  wealth: wealth,
  projectedIncome: projectedIncome,
  projectedWealth: projectedWealth,
});

export type Store = z.infer<typeof storeValidator>;
