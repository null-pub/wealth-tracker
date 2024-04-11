import { Box, Divider, Stack, Tooltip, Typography } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { ReactNode, useMemo } from "react";
import { Cash } from "shared/components/formatters/cash";
import { Duration } from "shared/components/formatters/duration";
import { Percent } from "shared/components/formatters/percent";
import { Until } from "shared/components/formatters/until";
import { useBaseIncome } from "shared/hooks/use-base-income";
import { useDateRanges } from "shared/hooks/use-dates";
import { useMostFrequentValue } from "shared/hooks/use-most-frequent-value";
import { useProjectedPay } from "shared/hooks/use-projected-pay";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import { Cluster } from "../hooks/use-gradient";
import { IncomePerPeriodTooltip } from "./income-per-period";
import { Value } from "./value";

export const MeritOutcome = (props: { title: ReactNode; payDate: DateTime; paycheck: Cluster[] }) => {
  const { title, payDate } = props;

  const dateRanges = useDateRanges(payDate.year);
  const income = useBaseIncome(dateRanges.base.start, dateRanges.base.end);

  const projectedPay = useProjectedPay();
  const baseAprToApr = useMemo(() => {
    const pay = projectedPay.find((x) => {
      return x.start <= payDate && payDate <= x.end;
    });

    return (pay?.value ?? 0) * 26;
  }, [payDate, projectedPay]);

  const meritIncreases = useStore(store, (x) => x.projectedIncome.timeSeries.meritIncreasePct);

  const commonMerit = useMostFrequentValue(meritIncreases);
  const meritPct = useStore(
    store,
    (x) => findSameYear(payDate, x.projectedIncome.timeSeries.meritIncreasePct)?.value ?? commonMerit
  );

  const equityPct = useStore(store, (x) => payDate && findSameYear(payDate, x.projectedIncome.timeSeries.equityPct));
  const totalAdjust = (meritPct ?? 0) + (equityPct?.value ?? 0);

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 2,
      }}
    >
      <Typography sx={{ paddingBottom: 1, paddingLeft: 2, paddingTop: 1 }} variant="h5">
        {title}
      </Typography>
      <Divider />

      <Stack padding={1} direction={"row"} spacing={0.5}>
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                maxWidth: "none",
              },
            },
          }}
          title={<IncomePerPeriodTooltip incomePerPeriod={income.incomePerPeriod} totalIncome={income.totalIncome} />}
        >
          <div>
            <Value title={"Base Pay"}>
              <Cash disableTooltip value={income.totalIncome ?? 0} />
            </Value>
          </div>
        </Tooltip>

        <Value title={"APR to APR"}>
          <Cash value={baseAprToApr} />
        </Value>

        <Value
          title={"Actual"}
          secondaryValue={
            <Until dateTime={payDate}>
              <Percent value={totalAdjust} />
            </Until>
          }
        >
          <Duration dateTime={payDate}>
            <Percent value={totalAdjust} />
          </Duration>
        </Value>
      </Stack>
    </Box>
  );
};
