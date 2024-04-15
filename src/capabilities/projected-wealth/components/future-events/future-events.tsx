import { Box, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { Value } from "capabilities/projected-income/components/value";
import { Cluster, useClusters } from "capabilities/projected-income/hooks/use-gradient";
import { useFutureRetirementContributions } from "capabilities/projected-wealth/hooks/use-future-retirement-contributions";
import { useFutureSavings } from "capabilities/projected-wealth/hooks/use-future-savings";
import {
  TresholdTax,
  useFutureMedicareTax,
  useFutureSocialSecurity,
} from "capabilities/projected-wealth/hooks/use-future-social-security";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { Card } from "shared/components/card";
import { Cash } from "shared/components/formatters/cash";
import { ClusterValues } from "shared/components/formatters/cluster-value";
import { CountDown } from "shared/components/formatters/countdown";
import { useDates } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { ExpectedValue, scaleClusters } from "shared/utility/cluster-helpers";
import { getLocalDateTime } from "shared/utility/current-date";
import { monthDay } from "shared/utility/format-date";

const isFuture = (date: DateTime) => date.diffNow("milliseconds").milliseconds > 0;

export const FutureEvents = (props: { year: number; onChange: (year: number) => void }) => {
  const { year, onChange } = props;
  const dates = useDates(year);

  const savings = useFutureSavings(year);
  const retirement = useFutureRetirementContributions(year);
  const medicare = useFutureMedicareTax(year);
  const socialSecurity = useFutureSocialSecurity(year);
  const clusters = useClusters(year);
  const bonusTakehomeFactor = useStore(store, (x) => 1 - x.projectedWealth.bonusWitholdingsRate);

  const total = useMemo(() => {
    const remaining = [
      isFuture(dates.meritBonus) && scaleClusters(clusters.meritBonus, bonusTakehomeFactor),
      isFuture(dates.companyBonus) && scaleClusters(clusters.companyBonus, bonusTakehomeFactor),
      isFuture(dates.retirementBonus) && clusters.retirementBonus,
      [{ min: savings.remaining, max: savings.remaining, probability: 1, median: 1 }],
      [{ min: retirement.remaining, max: retirement.remaining, probability: 1, median: 1 }],
      [{ min: socialSecurity.min?.remaining ?? 0, max: socialSecurity.max?.remaining ?? 0, probability: 1, median: 1 }],
      [{ min: medicare.min?.remaining, max: medicare.max?.remaining, probability: 1, median: 1 }],
    ].filter((x) => x !== false) as Cluster[][];

    return ExpectedValue(remaining);
  }, [
    bonusTakehomeFactor,
    clusters.companyBonus,
    clusters.meritBonus,
    clusters.retirementBonus,
    dates.companyBonus,
    dates.meritBonus,
    dates.retirementBonus,
    medicare.max?.remaining,
    medicare.min?.remaining,
    retirement.remaining,
    savings.remaining,
    socialSecurity.max?.remaining,
    socialSecurity.min?.remaining,
  ]);

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
            cluster={scaleClusters(clusters.meritBonus, bonusTakehomeFactor)}
          />
        )}
        {isFuture(dates.companyBonus) && (
          <ClusterCard
            title="Company Bonus"
            date={dates.companyBonus}
            cluster={scaleClusters(clusters.companyBonus, bonusTakehomeFactor)}
          />
        )}
        {isFuture(dates.retirementBonus) && (
          <ClusterCard title="Retirement Bonus" date={dates.retirementBonus} cluster={clusters.retirementBonus} />
        )}
        {!!socialSecurity.min && <ThresholdTaxCard thresholdTax={socialSecurity} title={"Social Security Limit"} />}
        {!!medicare.min && <ThresholdTaxCard thresholdTax={medicare} title={"Medicare Supplmental Tax"} />}

        <Card title={"Savings & Retirement"}>
          {!!savings.perMonth && (
            <Value title={"Expected savings"} secondaryValue={<Cash tooltip="Per Month" value={savings.perMonth} />}>
              <Cash tooltip="Total Remaining" value={savings.remaining} />
            </Value>
          )}
          {!!retirement.perPaycheck && (
            <Value
              title={"retirement contribution"}
              secondaryValue={<Cash tooltip="Per Paycheck" value={retirement.perPaycheck} />}
            >
              <Cash tooltip="Total Remaining" value={retirement.remaining} />
            </Value>
          )}
        </Card>
      </Stack>
    </>
  );
};

const ThresholdTaxCard = (props: { thresholdTax: TresholdTax; title: string }) => {
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
