export const formatPercent = new Intl.NumberFormat("en-us", {
  style: "percent",
  maximumFractionDigits: 1,
}).format;

export const formatPercentKatex = (value: number) =>
  new Intl.NumberFormat("en-us", {
    style: "percent",
    maximumFractionDigits: 1,
  })
    .format(value)
    .replace("%", "\\%");
