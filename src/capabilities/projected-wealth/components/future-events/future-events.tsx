import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Value } from "capabilities/projected-income/components/value";
import { useFutureMedicareTax } from "capabilities/projected-wealth/hooks/use-future-medicare-tax";
import { useFutureRetirementContributions } from "capabilities/projected-wealth/hooks/use-future-retirement-contributions";
import { useFutureSavings } from "capabilities/projected-wealth/hooks/use-future-savings";
import { useFutureSocialSecurity } from "capabilities/projected-wealth/hooks/use-future-social-security";
import { DateTime } from "luxon";
import { BeforeAfter } from "shared/components/formatters/before-after";
import { Cash } from "shared/components/formatters/cash";
import { Duration } from "shared/components/formatters/duration";
import { useDates } from "shared/hooks/use-dates";
import { getLocalDateTime } from "shared/utility/current-date";
import { monthDay } from "shared/utility/format-date";
import { ClusterValues } from "shared/components/formatters/cluster-value";
import { useClusters } from "capabilities/projected-income/hooks/use-gradient";
import { Card } from "shared/components/card";
import { scaleClusters } from "shared/utility/scale-cluster";
import { useStore } from "@tanstack/react-store";
import { store } from "shared/store";

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

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h5">
          {year} Remaining Projected Wealth <Cash value={0} />
        </Typography>
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
