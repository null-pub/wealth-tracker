export interface PaymentPeriod {
  start: string;
  end: string;
  payedOn: string;
  value: number;
  cumulative: number;
  type: PaymentType;
}

export const PaymentTypes = {
  regular: "regular",
  bonus: "taxable bonus",
  nonTaxableBonus: "non-taxable bonus",
} as const;

export type PaymentType = (typeof PaymentTypes)[keyof typeof PaymentTypes];
