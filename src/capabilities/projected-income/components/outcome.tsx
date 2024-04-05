import { Box, Divider, Stack, Typography } from "@mui/material";
import { Outcome as TOutcome } from "shared/utility/min-max-avg";
import { Value } from "./value";
import { DateTime } from "luxon";
import { Cash } from "shared/components/formatters/cash";
import { Duration } from "shared/components/formatters/duration";
import { Until } from "shared/components/formatters/until";
import { ReactNode } from "react";

export const Outcome = (props: { title: ReactNode; outcome: TOutcome; payDate?: DateTime }) => {
  const { outcome, title, payDate } = props;

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
        {!outcome.actual && (
          <>
            <Value title={"min"}>
              <Cash value={outcome.min} fallback={0} />
            </Value>
            <Value title={"avg"}>
              <Cash value={outcome.avg} fallback={0} />
            </Value>
            <Value title={"max"}>
              <Cash value={outcome.max} fallback={0} />
            </Value>
          </>
        )}
        {payDate && (
          <Value
            title={"Actual"}
            secondaryValue={
              <Until dateTime={payDate}>
                <Cash value={outcome.actual} />
              </Until>
            }
          >
            <Duration dateTime={payDate}>
              <Cash value={outcome.actual} />
            </Duration>
          </Value>
        )}
      </Stack>
    </Box>
  );
};
