import { Alert, CircularProgress, Tooltip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { Card } from "shared/components/card";
import { Cash } from "shared/components/formatters/cash";
import { ClusterValue, ClusterValues } from "shared/components/formatters/cluster-value";
import { CountDown } from "shared/components/formatters/countdown";
import { Value } from "shared/components/formatters/value";
import { useClusters } from "shared/hooks/use-clusters";
import { useDateRanges, useDates } from "shared/hooks/use-dates";
import { IncomePerPeriod } from "shared/models/IncomePerPeriod";
import { PaymentTypes } from "shared/models/payment-periods";
import { scenarioStore } from "shared/store/scenario-store";
import { getLocalDateTime } from "shared/utility/current-date";
import { monthDay } from "shared/utility/format-date";
import { Layout } from "./data-entry/data-entry";
import { IncomeChart } from "./income-chart";
import { IncomePerPeriodTooltip } from "./income-per-period";
import { useHasMeritPairs } from "./use-has-merit-pairs";

export const ProjectedIncome = () => {
  const [selectedYear, setSelectedYear] = useState(getLocalDateTime().year);

  const hasMissingPairs = useHasMeritPairs();
  const clusters = useClusters(selectedYear);
  const dates = useDates(selectedYear);
  const dateRanges = useDateRanges(selectedYear);

  const basePay = useMemo(() => {
    if (clusters.pay.length !== 1) {
      return;
    }
    return clusters.scenarios?.[0].basePay;
  }, [clusters.pay.length, clusters.scenarios]);

  const aprToApr = useMemo(() => {
    if (clusters.pay.length !== 1) {
      return;
    }
    return clusters.scenarios?.[0].aprToApr;
  }, [clusters.pay.length, clusters.scenarios]);

  const paychecks = useMemo(() => {
    if (clusters.pay.length !== 1) {
      return;
    }

    const payPeriods =
      clusters.scenarios?.[0].payments.filter((x) => {
        const payedOn = DateTime.fromISO(x.payedOn);
        return payedOn >= dateRanges.base.start && payedOn <= dateRanges.base.end;
      }) ?? [];

    return payPeriods
      .filter((x) => x.type !== PaymentTypes.bonus)
      .reduceRight(
        (acc, curr) => {
          if (acc[0]?.[0]?.value === curr.value) {
            acc[0].unshift(curr);
          } else {
            acc.unshift([curr]);
          }

          return acc;
        },
        [] as (typeof payPeriods)[]
      )
      .reduce((acc, curr) => {
        acc.push({
          start: DateTime.fromISO(curr[0].payedOn),
          end: DateTime.fromISO(curr[curr.length - 1].payedOn),
          value: curr.reduce((acc, curr) => acc + curr.value, 0),
          perPayday: curr[0].value,
          count: curr.length,
          type: curr[0].type,
        });

        return acc;
      }, [] as IncomePerPeriod[]);
  }, [clusters.pay.length, clusters.scenarios, dateRanges.base.end, dateRanges.base.start]);

  const scenarios = useStore(scenarioStore);

  return (
    <Box display="flex" flexDirection="row" height="100%" width={"100%"}>
      <Box flex="0 1 auto" maxWidth={500} height="100%">
        <Stack gap={2} direction={"column"} overflow={"auto"} height="100%" paddingRight={1} minWidth={500}>
          {!hasMissingPairs && (
            <Alert severity="error">Every Merit Increase must have a paired Merit Bonus percent</Alert>
          )}
          <Card
            title={
              <Box display="flex" alignItems={"center"} gap={2} width={"100%"}>
                <span>Income</span>
                <CountDown dateTime={dates.companyBonus} variant="date" dateFormat={monthDay} />
                <Box sx={{ display: "flex", marginLeft: "auto", alignItems: "center", flexWrap: "wrap" }}>
                  {scenarios.loading && <CircularProgress style={{ width: 20, height: 20 }} />}
                </Box>
                <DatePicker
                  sx={{ width: 90, marginRight: 2 }}
                  label={"year"}
                  views={["year"]}
                  minDate={getLocalDateTime().set({ year: scenarios.minYear })}
                  maxDate={getLocalDateTime().set({ year: scenarios.maxYear })}
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
                <CountDown dateTime={dates.meritIncrease} variant="date" dateFormat={monthDay} />
              </Box>
            }
          >
            {!basePay && <ClusterValues clusters={clusters.pay} eventDate={dates.meritIncrease} compact={false} />}
            {basePay && (
              <>
                <ClusterValue {...clusters.pay[0]} title={"Paycheck"} compact={false} />
                <Tooltip
                  placement="bottom"
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
                <Value title={"APR to APR"}>
                  <Cash value={aprToApr} />
                </Value>
              </>
            )}
          </Card>
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Merit Increase</span>
                <CountDown dateTime={dates.meritIncrease} variant="date" dateFormat={monthDay} />
              </Box>
            }
          >
            <ClusterValues clusters={clusters.meritIncrease} eventDate={dates.meritIncrease} />
          </Card>

          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Merit Bonus</span>
                <CountDown dateTime={dates.meritBonus} variant="date" dateFormat={monthDay} />
              </Box>
            }
          >
            <ClusterValues clusters={clusters.meritBonus} eventDate={dates.meritBonus} />
          </Card>
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Company Bonus</span>
                <CountDown dateTime={dates.companyBonus} variant="date" dateFormat={monthDay} />
              </Box>
            }
          >
            <ClusterValues clusters={clusters.companyBonus} eventDate={dates.companyBonus} />
          </Card>
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Retirement Bonus</span>
                <CountDown dateTime={dates.retirementBonus} variant="date" dateFormat={monthDay} />
              </Box>
            }
          >
            <ClusterValues clusters={clusters.retirementBonus} eventDate={dates.retirementBonus} />
          </Card>
          {!scenarios.loading && (
            <div css={{ width: "100%", height: 285 }}>
              <IncomeChart />
            </div>
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
            dateVariant="year"
          />
          <Layout
            title="Equity Increase"
            accountName="equityPct"
            variant="percent"
            defaultDate={dates.meritIncrease}
            dateVariant="year"
          />
          <Layout
            title="Merit Bonus"
            accountName="meritBonusPct"
            variant="percent"
            defaultDate={dates.meritBonus}
            dateVariant="year"
          />
          <Layout title="Merit Bonus" accountName="meritBonus" variant="cash" defaultDate={dates.meritBonus} />
          <Layout
            title="Company Bonus Factor"
            accountName="companyBonusPct"
            defaultDate={dates.companyBonus}
            variant="percent"
            dateVariant="year"
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
