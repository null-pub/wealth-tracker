import { Box, Stack } from "@mui/system";
import { Value } from "capabilities/projected-income/components/value";
import { useFutureMedicareTax } from "capabilities/projected-wealth/hooks/use-future-medicare-tax";
import { useFutureRetirementContributions } from "capabilities/projected-wealth/hooks/use-future-retirement-contributions";
import { useFutureSavings } from "capabilities/projected-wealth/hooks/use-future-savings";
import { useFutureSocialSecurity, useSocial2 } from "capabilities/projected-wealth/hooks/use-future-social-security";
import { DateTime } from "luxon";
import { BeforeAfter } from "shared/components/formatters/before-after";
import { Cash } from "shared/components/formatters/cash";
import { Duration } from "shared/components/formatters/duration";
import { useDates } from "shared/hooks/use-dates";
import { getLocalDateTime } from "shared/utility/current-date";
import { monthDay } from "shared/utility/format-date";
import { ClusterValues } from "shared/components/formatters/cluster-value";
import { Cluster, useClusters } from "capabilities/projected-income/hooks/use-gradient";
import { Card } from "shared/components/card";
import { scaleClusters, ExpectedValue } from "shared/utility/cluster-helpers";
import { useStore } from "@tanstack/react-store";
import { store } from "shared/store";
import { useMemo } from "react";

const isFuture = (date: DateTime) => date.diffNow("milliseconds").milliseconds > 0;

export const FutureEvents = () => {
  const year = getLocalDateTime().year;
  const dates = useDates(year);

  const savings = useFutureSavings();
  const retirement = useFutureRetirementContributions();
  const medicare = useFutureMedicareTax();
  const socialSecurity = useFutureSocialSecurity();
  useSocial2();
  const clusters = useClusters(year);
  const bonusTakehomeFactor = useStore(store, (x) => 1 - x.projectedWealth.bonusWitholdingsRate);

  const total = useMemo(() => {
    const remaining = [
      isFuture(dates.meritBonus) && scaleClusters(clusters.meritBonus, bonusTakehomeFactor),
      isFuture(dates.companyBonus) && scaleClusters(clusters.companyBonus, bonusTakehomeFactor),
      isFuture(dates.retirementBonus) && clusters.retirementBonus,
      [{ min: savings.remaining, max: savings.remaining, probability: 1 }],
      [{ min: retirement.remaining, max: retirement.remaining, probability: 1 }],
      [{ min: socialSecurity.remaining, max: socialSecurity.remaining, probability: 1 }],
      [{ min: medicare.remaining, max: medicare.remaining, probability: 1 }],
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
    medicare.remaining,
    retirement.remaining,
    savings.remaining,
    socialSecurity.remaining,
  ]);

  return (
    <>
      <Stack spacing={2}>
        <Card title={`${year} Remaining Projected Wealth`}>
          <ClusterValues clusters={total} eventDate={dates.companyBonus} />
        </Card>
        {isFuture(dates.meritBonus) && (
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Merit Bonus</span>
                <Duration dateTime={dates.meritBonus} />
              </Box>
            }
          >
            <ClusterValues
              clusters={scaleClusters(clusters.meritBonus, bonusTakehomeFactor)}
              eventDate={dates.meritBonus}
            />
          </Card>
        )}
        {isFuture(dates.companyBonus) && (
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={2} marginRight={2}>
                <span>Company Bonus</span>
                <Duration dateTime={dates.companyBonus} />
              </Box>
            }
          >
            <ClusterValues
              clusters={scaleClusters(clusters.companyBonus, bonusTakehomeFactor)}
              eventDate={dates.companyBonus}
            />
          </Card>
        )}
        {isFuture(dates.retirementBonus) && (
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
        )}
        <Card title="Taxes">
          {!!socialSecurity.total && (
            <Value
              title={"social security cap"}
              secondaryValue={
                <BeforeAfter
                  dateTime={socialSecurity.firstOccurrence}
                  before={<Cash tooltip="Remaining" value={socialSecurity.remaining} />}
                  after={<Cash tooltip="Per Paycheck" value={socialSecurity.perPaycheck} />}
                />
              }
            >
              <Duration dateFormat={monthDay} variant="date" dateTime={socialSecurity.firstOccurrence}>
                <Cash tooltip="Remaining" value={socialSecurity.remaining} />
              </Duration>
            </Value>
          )}
          {!!medicare.total && (
            <Value
              title={"medicare supplemental tax"}
              secondaryValue={
                <BeforeAfter
                  dateTime={medicare.firstOccurrence}
                  before={<Cash tooltip="Total" value={medicare.remaining} />}
                  after={<Cash tooltip="Per Paycheck" value={medicare.perPaycheck} />}
                />
              }
            >
              <Duration dateFormat={monthDay} variant="date" dateTime={medicare.firstOccurrence}>
                <Cash tooltip="Remaining" value={medicare.remaining} />
              </Duration>
            </Value>
          )}
        </Card>
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
