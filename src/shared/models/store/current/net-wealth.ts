import { z } from "zod";
import { accountValidator } from "./account";
import { mortgageValidator } from "./mortgage";

export const wealth = z.record(z.union([accountValidator, mortgageValidator]));

export type Wealth = z.infer<typeof wealth>;
