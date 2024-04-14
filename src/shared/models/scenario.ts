import { AccountData } from "./store/current";

export interface Scenario {
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
  payments: {
    start: string;
    end: string;
    payedOn: string;
    value: number;
    cumulative: number;
  }[];
  equityIncreasePct: number;
  retirementBonusPct: number;
  aprToApr: number;
  taxablePay: number;
  currentPaymentIdx: number;
  remainingPayments: number;
}
