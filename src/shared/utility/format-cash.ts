export const formatCashShort = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 0,
  minimumSignificantDigits: 3,
  maximumSignificantDigits: 3,
}).format;

export const formatCash = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}).format;

export const formatDeltaCash = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
}).format;
