import { PaymentType } from "./payment-periods";
import { AccountData } from "./store/current";

export interface ScenarioPayment {
  start: string;
  end: string;
  payedOn: string;
  value: number;
  cumulative: number;
  type: PaymentType;
}

export interface Scenario {
  year: number;
  totalPay: number;
  basePay: number;
  meritBonus: number;
  companyBonus: number;
  retirementBonus: number;
  companyBonusFactor: number;
  companyBonusPct: number;
  pay: AccountData[];
  lastThreeMeritBonusFactor: number;
  lastThreeMeritBonuses: number[];
  meritBonusPct: number;
  meritIncreasePct: number;
  payments: ScenarioPayment[];
  equityIncreasePct: number;
  retirementBonusPct: number;
  aprToApr: number;
  taxablePay: number;
  currentPaymentIdx: number;
  remainingRegularPayments: number;
  weight: number;
}
