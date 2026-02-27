export const formatPercent = new Intl.NumberFormat("en-us", {
  style: "percent",
  maximumFractionDigits: 1,
}).format;

export const formatPercentSigns = new Intl.NumberFormat("en-us", {
  style: "percent",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  signDisplay: "exceptZero",
}).format;
