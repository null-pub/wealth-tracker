import { CircularProgress, Tooltip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useState } from "react";
import { Card } from "shared/components/card";
import { Cash } from "shared/components/formatters/cash";
import { ClusterValue, ClusterValues } from "shared/components/formatters/cluster-value";
import { CountDown } from "shared/components/formatters/countdown";
import { Value } from "shared/components/formatters/value";
import { useClusters } from "shared/hooks/use-clusters";
import { useDateRanges, useDates } from "shared/hooks/use-dates";
import { IncomePerPeriod } from "shared/models/income-per-period";
import { PaymentTypes } from "shared/models/payment-periods";
import { scenarioStore } from "shared/store/scenario-store";
import { ChunkByEquality } from "shared/utility/chunk-by-equality";
import { getLocalDateTime } from "shared/utility/current-date";
import { monthDay } from "shared/utility/format-date";
import { DataEntryLayout } from "./data-entry/data-entry";
import { IncomeChart } from "./income-chart";
import { IncomePerPeriodTooltip } from "./income-per-period";
import { MeritEntryLayout } from "./merit-entry";

const usePayments = (year: number) => {
  const dateRanges = useDateRanges(year);
  const clusters = useClusters(year);

  if (clusters.pay.length !== 1) {
    return {};
  }
  const firstScenario = clusters.scenarios?.at(0);
  const payPeriods =
    firstScenario?.payments
      .filter((x) => x.type === PaymentTypes.regular)
      .filter((x) => {
        const payedOn = DateTime.fromISO(x.payedOn);
        return payedOn >= dateRanges.base.start && payedOn <= dateRanges.base.end;
      }) ?? [];

  const paychecks = ChunkByEquality(payPeriods, (x) => x.value).map((curr) => {
    return {
      start: DateTime.fromISO(curr[0].payedOn),
      end: DateTime.fromISO(curr[curr.length - 1].payedOn),
      value: curr.reduce((acc, curr) => acc + curr.value, 0),
      perPayday: curr[0].value,
      count: curr.length,
      type: curr[0].type,
    } as IncomePerPeriod;
  });

  return { aprToApr: firstScenario?.aprToApr, basePay: firstScenario?.basePay, paychecks };
};

export const ProjectedIncome = () => {
  const [selectedYear, setSelectedYear] = useState(getLocalDateTime().year);
  const { aprToApr, basePay, paychecks } = usePayments(selectedYear);
  const clusters = useClusters(selectedYear);

  const dates = useDates(selectedYear);
  const scenarios = useStore(scenarioStore);

  return (
    <Box display="flex" flexDirection="row" height="100%" width={"100%"}>
      <Box flex="0 1 auto" maxWidth={500} height="100%">
        <Stack gap={2} direction={"column"} overflow={"auto"} height="100%" paddingRight={1} minWidth={500}>
          <Card
            title={
              <Box display="flex" alignItems={"center"} gap={2} width={"100%"}>
                <span>Income</span>
                <CountDown dateTime={dates.companyBonus} variant="date" dateFormat={monthDay} />
                <IncomeChart />
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
                  onChange={(value) => {
                    setSelectedYear(value?.year ?? getLocalDateTime().year);
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
                  slotProps={{
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
        </Stack>
      </Box>
      <Box flex="1 1 auto" overflow={"auto"} paddingBottom={2} paddingLeft={1}>
        <Box display={"flex"} height={"100%"} width={"100%"} gap={2}>
          <DataEntryLayout
            dateVariant="year"
            accountName="paycheck"
            variant="cash"
            defaultDate={DateTime.fromObject({
              day: 1,
              month: 4,
              year: selectedYear,
            })}
            title="Income Per Paycheck"
          />
          {/*<Layout
            title="Merit Increase"
            accountName="meritIncreasePct"
            variant="percent"
            defaultDate={dates.meritIncrease}
            dateVariant="year"
          />
          <Layout title="Equity Increase" accountName="equityPct" variant="percent" defaultDate={dates.meritIncrease} dateVariant="year" />
          <Layout title="Merit Bonus" accountName="meritBonusPct" variant="percent" defaultDate={dates.meritBonus} dateVariant="year" />*/}
          <MeritEntryLayout title={"Merit Factors"} defaultDate={dates.meritBonus} />
          <DataEntryLayout title="Merit Bonus" accountName="meritBonus" variant="cash" defaultDate={dates.meritBonus} />
          <DataEntryLayout
            title="Company Bonus Factor"
            accountName="companyBonusPct"
            defaultDate={dates.companyBonus}
            variant="percent"
            dateVariant="year"
          />
          <DataEntryLayout title="Company Bonus" accountName="companyBonus" defaultDate={dates.companyBonus} variant="cash" />
          <DataEntryLayout title="Retirement Bonus" accountName="retirementBonus" defaultDate={dates.retirementBonus} variant="cash" />
        </Box>
      </Box>
    </Box>
  );
};
