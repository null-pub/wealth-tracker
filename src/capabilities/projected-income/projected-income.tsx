import { Box, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useState } from "react";
import { Duration } from "shared/components/formatters/duration";
import { useDates } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { Layout } from "./components/data-entry/data-entry";
import { MeritOutcome } from "./components/merit-increase";
import { Outcome } from "./components/outcome";
import { useClusters } from "./hooks/use-gradient";

export const ProjectedIncome = () => {
  const [selectedYear, setSelectedYear] = useState(getLocalDateTime().year);
  const oldestYear = useStore(store, (x) => {
    const first = x.projectedIncome.timeSeries.paycheck[1]?.date;
    const date = first ? DateTime.fromISO(first) : getLocalDateTime();
    return date.year;
  });

  const result = useClusters(selectedYear);
  const dates = useDates(selectedYear);

  return (
    <Box display="flex" flexDirection="column" height="100%" gap={2}>
      <Box flex="0 1 auto">
        <Stack gap={2} direction={"row"} overflow={"auto"}>
          <Outcome
            cluster={result.totalPay}
            title={
              <Box display="flex" alignItems={"center"} gap={2} width={"100%"}>
                <span>Income</span>
                <Duration dateTime={dates.companyBonus} />
                <DatePicker
                  sx={{ width: 90, marginLeft: "auto", marginRight: 2 }}
                  label={"year"}
                  views={["year"]}
                  minDate={getLocalDateTime().set({ year: oldestYear })}
                  maxDate={getLocalDateTime().plus({ years: 2 })}
                  defaultValue={getLocalDateTime()}
                  slotProps={{
                    textField: {
                      variant: "standard",
                      label: "",
                    },
                  }}
                  onYearChange={(year) => {
                    setSelectedYear(year.year);
                  }}
                />
              </Box>
            }
          />
          <Outcome
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Paycheck</span>
                <Duration dateTime={dates.meritIncrease} />
              </Box>
            }
            compact={false}
            cluster={result.pay}
          />
          <Outcome
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Merit Increase</span>
                <Duration dateTime={dates.meritIncrease} />
              </Box>
            }
            compact={false}
            cluster={result.meritIncrease}
          />
          <MeritOutcome
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Base Pay</span>
                <Duration dateTime={dates.meritIncrease} />
              </Box>
            }
            payDate={dates.meritIncrease}
            paycheck={result.pay}
          />
          <Outcome
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Merit Bonus</span>
                <Duration dateTime={dates.meritBonus} />
              </Box>
            }
            cluster={result.meritBonus}
          />
          <Outcome
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Company Bonus</span>
                <Duration dateTime={dates.companyBonus} />
              </Box>
            }
            cluster={result.companyBonus}
          />
          <Outcome
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Retirement Bonus</span>
                <Duration dateTime={dates.retirementBonus} />
              </Box>
            }
            cluster={result.retirementBonus}
          />
        </Stack>
      </Box>
      <Box flex="1 1 auto">
        <Box overflow={"auto"} width={"100%"} height={"100%"}>
          <Box height={"100%"} display={"flex"} gap={2} flexWrap={"nowrap"} flexShrink={0}>
            <Layout
              accountName="paycheck"
              variant="cash"
              defaultDate={DateTime.fromObject({
                day: 1,
                month: 4,
                year: selectedYear,
              })}
              title="Income Per Paycheck"
            />
            <Layout
              title="Merit Increase"
              accountName="meritIncreasePct"
              variant="percent"
              defaultDate={dates.meritIncrease}
            />
            <Layout
              title="Equity Increase"
              accountName="equityPct"
              variant="percent"
              defaultDate={dates.meritIncrease}
            />
            <Layout title="Merit Bonus" accountName="meritBonusPct" variant="percent" defaultDate={dates.meritBonus} />
            <Layout title="Merit Bonus" accountName="meritBonus" variant="cash" defaultDate={dates.meritBonus} />
            <Layout
              title="Company Bonus Factor"
              accountName="companyBonusPct"
              defaultDate={dates.companyBonus}
              variant="percent"
            />
            <Layout title="Company Bonus" accountName="companyBonus" defaultDate={dates.companyBonus} variant="cash" />
            <Layout
              title="Retirement Bonus"
              accountName="retirementBonus"
              defaultDate={dates.retirementBonus}
              variant="cash"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
