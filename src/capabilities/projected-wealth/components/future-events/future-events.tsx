import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Value } from "capabilities/projected-income/components/value";
import { useFutureBonuses } from "capabilities/projected-wealth/hooks/use-future-bonuses";
import { useFutureMedicareTax } from "capabilities/projected-wealth/hooks/use-future-medicare-tax";
import { useFutureRetirementContributions } from "capabilities/projected-wealth/hooks/use-future-retirement-contributions";
import { useFutureSavings } from "capabilities/projected-wealth/hooks/use-future-savings";
import { useFutureSocialSecurity } from "capabilities/projected-wealth/hooks/use-future-social-security";
import { DateTime } from "luxon";
import { BeforeAfter } from "shared/components/formatters/before-after";
import { Cash } from "shared/components/formatters/cash";
import { Duration } from "shared/components/formatters/duration";
import { useCompanyBonus } from "shared/hooks/use-company-bonus";
import { useDates } from "shared/hooks/use-dates";
import { useMeritBonus } from "shared/hooks/use-merit-bonus";
import { useRetirementBonus } from "shared/hooks/use-retirement-bonus";
import { getLocalDateTime } from "shared/utility/current-date";
import { monthDay } from "shared/utility/format-date";

const isFuture = (date: DateTime) => date.diffNow("milliseconds").milliseconds > 0;

export const FutureEvents = () => {
  const dates = useDates();
  const systemYear = getLocalDateTime().year;
  const savings = useFutureSavings();
  const retirement = useFutureRetirementContributions();
  const medicare = useFutureMedicareTax();
  const socialSecurity = useFutureSocialSecurity();
  const meritBonus = useMeritBonus(systemYear);
  const companyBonus = useCompanyBonus(systemYear);
  const retirementBonus = useRetirementBonus(systemYear);
  const totalFutureBonuses = useFutureBonuses();

  const total =
    totalFutureBonuses + savings.remaining + retirement.remaining + socialSecurity.remaining + medicare.remaining;

  return (
    <>
      <Typography variant="h5">
        {systemYear} Remaining Projected Wealth <Cash value={total} />
      </Typography>
      <Stack direction={"row"} sx={{ "&& > *": { minWidth: 210 } }}>
        {isFuture(dates.meritBonus) && (
          <Value title={"merit bonus"} secondaryValue={<Cash value={meritBonus.cash.actual ?? meritBonus.cash.avg} />}>
            <Duration dateFormat={monthDay} variant="date" dateTime={dates.meritBonus} />
          </Value>
        )}
        {isFuture(dates.companyBonus) && (
          <Value
            title={"company bonus"}
            secondaryValue={<Cash value={companyBonus.cash.actual ?? companyBonus.cash.avg} />}
          >
            <Duration variant="date" dateFormat={monthDay} dateTime={dates.companyBonus} />
          </Value>
        )}
        {isFuture(dates.retirementBonus) && (
          <Value
            title={"retirement bonus"}
            secondaryValue={<Cash value={retirementBonus.cash.actual ?? retirementBonus.cash.avg} />}
          >
            <Duration dateFormat={monthDay} variant="date" dateTime={dates.retirementBonus} />
          </Value>
        )}
      </Stack>
      <Stack direction={"row"} sx={{ "&& > *": { minWidth: 210 } }}>
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
      </Stack>
      <Stack direction={"row"} sx={{ "&& > *": { minWidth: 210 } }}>
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
      </Stack>
    </>
  );
};
