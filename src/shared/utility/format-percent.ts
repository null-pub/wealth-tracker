export const formatPercent = new Intl.NumberFormat("en-us", {
  style: "percent",
  maximumFractionDigits: 1,
}).format;
