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

/**
 * Interface representing a financial scenario with projected income and weights
 *
 * @interface Scenario
 * @property {number} year - The year of the scenario
 * @property {number} totalPay - Total pay including all bonuses and increases
 * @property {number} basePay - Base pay amount
 * @property {number} meritBonus - Amount of merit bonus
 * @property {number} companyBonus - Amount of company bonus
 * @property {number} retirementBonus - Amount of retirement bonus
 * @property {number} companyBonusFactor - Factor for company bonus calculation
 * @property {number} companyBonusPct - Percentage of company bonus
 * @property {AccountData[]} pay - Array of account data
 * @property {number} lastThreeMeritBonusFactor - Factor for last three merit bonuses
 * @property {number[]} lastThreeMeritBonuses - Array of last three merit bonuses
 * @property {number} meritBonusPct - Percentage of merit bonus
 * @property {number} meritIncreasePct - Percentage increase from merit raises
 * @property {ScenarioPayment[]} payments - Array of payment periods in the scenario
 * @property {number} equityIncreasePct - Percentage increase from equity compensation
 * @property {number} retirementBonusPct - Percentage of retirement bonus
 * @property {number} aprToApr - APR to APR value
 * @property {number} taxablePay - Total taxable pay amount
 * @property {number} currentPaymentIdx - Index of the current payment
 * @property {number} remainingRegularPayments - Number of regular payments remaining
 * @property {number} weight - Statistical weight of this scenario for probability calculations
 */
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
