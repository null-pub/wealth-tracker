import { PaymentPeriod } from "./payment-periods";
import { AccountData } from "./store/current";

export interface MeritSequence {
  year: number;
  pay: AccountData[];
  lastThreeMeritBonusFactor: number;
  lastThreeMeritBonuses: number[];
  meritBonusPct: number;
  meritIncreasePct: number;
  payments: PaymentPeriod[];
  equityIncreasePct: number;
  retirementBonusPct: number;
  weight: number;
}
