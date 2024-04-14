import { z } from "zod";
import { wealth } from "./net-wealth";
import { projectedIncome } from "./projected-income";
import { projectedWealth } from "./projected-wealth";

export const storeValidator = z.object({
  wealth: wealth,
  projectedIncome: projectedIncome,
  projectedWealth: projectedWealth,
});

export type Store = z.infer<typeof storeValidator>;
