import { Box, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { Duration } from "shared/components/formatters/duration";
import { useDateRanges, useDates } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { getLocalDateTime } from "shared/utility/current-date";
import { Layout } from "./components/data-entry/data-entry";
import { useClusters } from "./hooks/use-gradient";
import { Alert, Tooltip } from "@mui/material";
import { Cash } from "shared/components/formatters/cash";
import { Value } from "./components/value";
import { IncomePerPeriodTooltip } from "./components/income-per-period";
import { useHasMeritPairs } from "./hooks/use-has-merit-pairs";
import { IncomePerPeriod } from "shared/models/IncomePerPeriod";
import { Card } from "shared/components/card";
import { ClusterValues } from "shared/components/formatters/cluster-value";

export const ProjectedIncome = () => {
  const [selectedYear, setSelectedYear] = useState(getLocalDateTime().year);
  const oldestYear = useStore(store, (x) => {
    const first = x.projectedIncome.timeSeries.paycheck[1]?.date;
    const date = first ? DateTime.fromISO(first) : getLocalDateTime();
    return date.year;
  });

  const hasMissingPairs = useHasMeritPairs();
  const clusters = useClusters(selectedYear);
  const dates = useDates(selectedYear);
  const dateRanges = useDateRanges(selectedYear);

  const basePay = useMemo(() => {
    if (clusters.pay.length !== 1) {
      return;
    }
    return clusters.scenarios[0].basePay;
  }, [clusters.pay.length, clusters.scenarios]);

  const aprToApr = useMemo(() => {
    if (clusters.pay.length !== 1) {
      return;
    }
    return clusters.scenarios[0].aprToApr;
  }, [clusters.pay.length, clusters.scenarios]);

  const paychecks = useMemo(() => {
    if (clusters.pay.length !== 1) {
      return;
    }

    const payPeriods = clusters.scenarios[0].payments.filter(
      (x) => x.payedOn >= dateRanges.base.start && x.payedOn <= dateRanges.base.end
    );

    return payPeriods
      .reduceRight((acc, curr) => {
        if (acc[0]?.[0]?.value === curr.value) {
          acc[0].unshift(curr);
        } else {
          acc.unshift([curr]);
        }

        return acc;
      }, [] as (typeof payPeriods)[])
      .reduce((acc, curr) => {
        acc.push({
          start: curr[0].payedOn,
          end: curr[curr.length - 1].payedOn,
          value: curr.reduce((acc, curr) => acc + curr.value, 0),
          perPayday: curr[0].value,
          count: curr.length,
        });
        return acc;
      }, [] as IncomePerPeriod[]);
  }, [clusters.pay.length, clusters.scenarios, dateRanges.base.end, dateRanges.base.start]);

  return (
    <Box display="flex" flexDirection="row" height="100%" width={"100%"}>
      <Box flex="0 1 auto">
        <Stack gap={2} direction={"column"} overflow={"auto"} height="100%" paddingRight={1}>
          <Card
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
          >
            <ClusterValues clusters={clusters.totalPay} eventDate={dates.companyBonus} />
          </Card>
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Paycheck</span>
                <Duration dateTime={dates.meritIncrease} />
              </Box>
            }
          >
            <ClusterValues clusters={clusters.pay} eventDate={dates.meritIncrease} compact={false} />
            {basePay && (
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      maxWidth: "none",
                    },
                  },
                }}
                title={paychecks && <IncomePerPeriodTooltip incomePerPeriod={paychecks} />}
              >
                <div>
                  <Value title={"Base Pay"}>
                    <Cash disableTooltip value={basePay} />
                  </Value>
                </div>
              </Tooltip>
            )}
            {aprToApr && (
              <Value title={"APR to APR"}>
                <Cash value={aprToApr} />
              </Value>
            )}
          </Card>
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Merit Increase</span>
                <Duration dateTime={dates.meritIncrease} />
              </Box>
            }
          >
            <ClusterValues clusters={clusters.meritIncrease} eventDate={dates.meritIncrease} />
          </Card>

          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Merit Bonus</span>
                <Duration dateTime={dates.meritBonus} />
              </Box>
            }
          >
            <ClusterValues clusters={clusters.meritBonus} eventDate={dates.meritBonus} />
          </Card>
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Company Bonus</span>
                <Duration dateTime={dates.companyBonus} />
              </Box>
            }
          >
            <ClusterValues clusters={clusters.companyBonus} eventDate={dates.companyBonus} />
          </Card>
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Retirement Bonus</span>
                <Duration dateTime={dates.retirementBonus} />
              </Box>
            }
          >
            <ClusterValues clusters={clusters.retirementBonus} eventDate={dates.retirementBonus} />
          </Card>
          {!hasMissingPairs && (
            <Alert severity="error">Every Merit Increase must have a paired Merit Bonus percent</Alert>
          )}
        </Stack>
      </Box>
      <Box flex="1 1 auto" overflow={"auto"} paddingBottom={2} paddingLeft={1}>
        <Box display={"flex"} height={"100%"} width={"100%"} gap={2}>
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
          <Layout title="Equity Increase" accountName="equityPct" variant="percent" defaultDate={dates.meritIncrease} />
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
  );
};
