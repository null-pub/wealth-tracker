import { Box, Stack } from "@mui/system";
import { useStore } from "@tanstack/react-store";
import { Value } from "capabilities/projected-income/components/value";
import { Cluster, useClusters } from "capabilities/projected-income/hooks/use-gradient";
import { useFutureRetirementContributions } from "capabilities/projected-wealth/hooks/use-future-retirement-contributions";
import { useFutureSavings } from "capabilities/projected-wealth/hooks/use-future-savings";
import {
  useFutureMedicareTax,
  useFutureSocialSecurity,
} from "capabilities/projected-wealth/hooks/use-future-social-security";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { Card } from "shared/components/card";
import { Cash } from "shared/components/formatters/cash";
import { ClusterValues } from "shared/components/formatters/cluster-value";
import { DateValue } from "shared/components/formatters/date";
import { Duration } from "shared/components/formatters/duration";
import { useDates } from "shared/hooks/use-dates";
import { store } from "shared/store";
import { ExpectedValue, scaleClusters } from "shared/utility/cluster-helpers";
import { getLocalDateTime } from "shared/utility/current-date";
import { monthDay } from "shared/utility/format-date";

const isFuture = (date: DateTime) => date.diffNow("milliseconds").milliseconds > 0;

export const FutureEvents = () => {
  const year = getLocalDateTime().year;
  const dates = useDates(year);

  const savings = useFutureSavings();
  const retirement = useFutureRetirementContributions();
  const medicare = useFutureMedicareTax();
  const socialSecurity = useFutureSocialSecurity();
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
        {!!socialSecurity.min && (
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={1} marginRight={2}>
                <span>Social Security Limit</span>
                {socialSecurity && socialSecurity.min !== socialSecurity.max && <span>on</span>}

                <DateValue dateFormat={monthDay} variant="date" dateTime={socialSecurity.max?.firstOccurrence} />
                {socialSecurity.min &&
                  socialSecurity.max &&
                  !socialSecurity.min.firstOccurrence.equals(socialSecurity.max.firstOccurrence) && (
                    <>
                      <span>or</span>
                      <DateValue dateFormat={monthDay} variant="date" dateTime={socialSecurity.min.firstOccurrence} />
                    </>
                  )}
              </Box>
            }
          >
            {socialSecurity.max && socialSecurity.max.total === socialSecurity.min.total && (
              <Value
                title={"Expected"}
                secondaryValue={<Cash tooltip="Per Paycheck" value={socialSecurity.max.perPaycheck} />}
              ></Value>
            )}
            {socialSecurity.max && socialSecurity.max.total !== socialSecurity.min.total && (
              <>
                <Value title={"Early"}>
                  <Cash tooltip="Remaining" value={socialSecurity.max?.remaining} compact={false} />
                </Value>
                <Value title={"Late"}>
                  <Cash tooltip="Remaining" value={socialSecurity.min.total} compact={false} />
                </Value>
              </>
            )}
            <Value title={"Per Paycheck"}>
              <Cash tooltip="Per Paycheck" value={socialSecurity.max?.perPaycheck} />
            </Value>
          </Card>
        )}
        {!!medicare.min && (
          <Card
            title={
              <Box display={"flex"} width={"max-content"} gap={1} marginRight={2}>
                <span>Medicare Supplemental Tax</span>
                {medicare && medicare.min !== medicare.max && <span>on</span>}
                <DateValue dateFormat={monthDay} variant="date" dateTime={medicare.max?.firstOccurrence} />
                {medicare.min && medicare.max && !medicare.min.firstOccurrence.equals(medicare.max.firstOccurrence) && (
                  <>
                    <span>or</span>
                    <DateValue dateFormat={monthDay} variant="date" dateTime={medicare.min.firstOccurrence} />
                  </>
                )}
              </Box>
            }
          >
            {medicare.max && medicare.max.total === medicare.min.total && (
              <Value title={"Expected"}>
                <Cash tooltip="Remaining" value={medicare.max.remaining} compact={false} />
              </Value>
            )}
            {medicare.max && medicare.max.total !== medicare.min.total && (
              <>
                <Value title={"Early"}>
                  <Cash tooltip="Remaining" value={medicare.min.total} compact={false} />
                </Value>
                <Value title={"Late"}>
                  <Cash tooltip="Remaining" value={medicare.max?.remaining} compact={false} />
                </Value>
              </>
            )}
            <Value title={"Per Paycheck"}>
              <Cash tooltip="Per Paycheck" value={medicare.max?.perPaycheck} />
            </Value>
          </Card>
        )}

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
