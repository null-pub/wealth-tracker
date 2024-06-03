import { Box, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { Card } from "shared/components/card";
import { Cash } from "shared/components/formatters/cash";
import { ClusterValues } from "shared/components/formatters/cluster-value";
import { CountDown } from "shared/components/formatters/countdown";
import { Value } from "shared/components/formatters/value";
import { Cluster, useClusters } from "shared/hooks/use-clusters";
import { useDates } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { scaleClusters } from "shared/utility/cluster-helpers";
import { getLocalDateTime } from "shared/utility/current-date";
import { monthDay } from "shared/utility/format-date";
import { useFutureMortgageEquity } from "./hooks/use-future-mortgage-equity";
import { useFutureRetirementContributions } from "./hooks/use-future-retirement-contributions";
import { useFutureSavings } from "./hooks/use-future-savings";
import { ThresholdTax, useFutureMedicareTax, useFutureSocialSecurity } from "./hooks/use-future-social-security";
import { useFutureTotals } from "./hooks/use-future-totals";

const isFuture = (date: DateTime) => date.diffNow("milliseconds").milliseconds > 0;

export const FutureEvents = (props: { year: number; onChange: (year: number) => void }) => {
  const { year, onChange } = props;
  const dates = useDates(year);

  const savings = useFutureSavings(year);
  const retirement = useFutureRetirementContributions(year);
  const medicare = useFutureMedicareTax(year);
  const socialSecurity = useFutureSocialSecurity(year);
  const clusters = useClusters(year);
  const bonusTakeHomeFactor = useStore(store, (x) => 1 - x.projectedWealth.bonusWithholdingsRate);
  const total = useFutureTotals(year);
  const equity = useFutureMortgageEquity(year);

  return (
    <>
      <Stack spacing={2} width={550} paddingRight={1}>
        <Card
          title={
            <>
              <span>Remaining Projected Wealth</span>
              <DatePicker
                sx={{ width: 90, marginRight: 2, marginLeft: "auto" }}
                label={"year"}
                views={["year"]}
                minDate={getLocalDateTime()}
                maxDate={getLocalDateTime().plus({ years: 1 })}
                value={getLocalDateTime().set({ year })}
                slotProps={{
                  textField: {
                    variant: "standard",
                    label: "",
                  },
                }}
                onYearChange={(year) => {
                  onChange(year.year);
                }}
              />
            </>
          }
        >
          <ClusterValues clusters={total} eventDate={dates.companyBonus} />
        </Card>
        {isFuture(dates.meritBonus) && (
          <ClusterCard
            title="Merit Bonus"
            date={dates.meritBonus}
            cluster={scaleClusters(clusters.meritBonus, bonusTakeHomeFactor)}
          />
        )}
        {isFuture(dates.companyBonus) && clusters.companyBonus.length > 0 && (
          <ClusterCard
            title="Company Bonus"
            date={dates.companyBonus}
            cluster={scaleClusters(clusters.companyBonus, bonusTakeHomeFactor)}
          />
        )}
        {isFuture(dates.retirementBonus) && clusters.retirementBonus.length > 0 && (
          <ClusterCard title="Retirement Bonus" date={dates.retirementBonus} cluster={clusters.retirementBonus} />
        )}
        {!!socialSecurity.min && <ThresholdTaxCard thresholdTax={socialSecurity} title={"Social Security Limit"} />}
        {!!medicare.min && <ThresholdTaxCard thresholdTax={medicare} title={"Medicare Supplemental Tax"} />}

        {(!!savings.perMonth || !!retirement.perPaycheck || !!equity) && (
          <Card title={"Savings & Retirement"}>
            {!!savings.perMonth && (
              <Value title={"savings"} secondaryValue={<Cash tooltip="Per Month" value={savings.perMonth} />}>
                <Cash tooltip="Total Remaining" value={savings.remaining} />
              </Value>
            )}
            {!!retirement.perPaycheck && (
              <Value
                title={"retirement"}
                secondaryValue={<Cash tooltip="Per Paycheck" value={retirement.perPaycheck} />}
              >
                <Cash tooltip="Total Remaining" value={retirement.remaining} />
              </Value>
            )}
            {!!equity && (
              <Value title={"Home Equity"}>
                <Cash tooltip="Total Remaining" value={equity} />
              </Value>
            )}
          </Card>
        )}
      </Stack>
    </>
  );
};

const ThresholdTaxCard = (props: { thresholdTax: ThresholdTax; title: string }) => {
  const { thresholdTax, title } = props;
  return (
    <Card
      title={
        <Box display={"flex"} width={"max-content"} gap={1} marginRight={2}>
          <span>{title}</span>

          <CountDown dateFormat={monthDay} variant="date" dateTime={thresholdTax.max?.firstOccurrence} />
          {thresholdTax.min &&
            thresholdTax.max &&
            !thresholdTax.min.firstOccurrence.equals(thresholdTax.max.firstOccurrence) && (
              <>
                <span>or</span>
                <CountDown dateFormat={monthDay} variant="date" dateTime={thresholdTax.min.firstOccurrence} />
              </>
            )}
        </Box>
      }
    >
      {thresholdTax.max && thresholdTax.max.total === thresholdTax.min?.total && (
        <Value title={"Remaining"}>
          <Cash value={thresholdTax.max?.remaining} compact={false} />
        </Value>
      )}
      {thresholdTax.max && thresholdTax.max.total !== thresholdTax.min?.total && (
        <>
          <Value title={thresholdTax.max.firstOccurrence > getLocalDateTime() ? "Early" : "Low"}>
            <Cash value={thresholdTax.max?.remaining} compact={false} />
          </Value>
          <Value title={thresholdTax.max.firstOccurrence > getLocalDateTime() ? "Late" : "High"}>
            <Cash value={thresholdTax.min?.total} compact={false} />
          </Value>
        </>
      )}
      <Value title={"Per Paycheck"}>
        <Cash value={thresholdTax.max?.perPaycheck} compact={false} />
      </Value>
    </Card>
  );
};

const ClusterCard = (props: { date: DateTime; cluster?: Cluster[]; title: string }) => {
  const { date, cluster, title } = props;
  return (
    <Card
      title={
        <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
          <span>{title}</span>
          <CountDown variant="date" dateFormat={monthDay} dateTime={date} />
        </Box>
      }
    >
      <ClusterValues clusters={cluster} eventDate={date} />
    </Card>
  );
};
