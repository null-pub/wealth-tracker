import { DateTime } from "luxon";
import { Loan } from "shared/models/store/current";

export const calcLoanBalance = (date: DateTime, loan: Loan) => {
  const { firstPaymentDate, paymentsPerYear, principal: principal, ratePct: rate, payment: monthlyPayment } = loan;
  const annualizedRate = rate / paymentsPerYear;
  const periods = date.diff(DateTime.fromISO(firstPaymentDate), "months").months;
  const totalRate = (1 + annualizedRate) ** periods;
  const balance = principal * totalRate - (monthlyPayment / annualizedRate) * (totalRate - 1);

  return balance;
};

export const calcEquity = (
  ownershipPct: number,
  houseValue: number | undefined,
  loanBalance: number,
  principal: number
) => {
  return houseValue ? houseValue * ownershipPct - loanBalance : principal - loanBalance;
};
