import { Box, Divider, Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { Cash } from "shared/components/formatters/cash";
import { Duration } from "shared/components/formatters/duration";
import { Percent } from "shared/components/formatters/percent";
import { BonusOutcomes } from "shared/utility/min-max-avg";
import { Value } from "./value";

export const BonusOutcome = (props: { title: string; outcome: BonusOutcomes; payDate: DateTime }) => {
  const { outcome, title, payDate } = props;

  return (
    <Box sx={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2 }}>
      <Typography
        sx={{
          paddingBottom: 1,
          paddingLeft: 2,
          paddingTop: 1,
          paddingRight: 2,
          width: "max-content",
        }}
        variant="h5"
      >
        {title}
      </Typography>
      <Divider />
      <Stack padding={1} direction={"row"} spacing={0.5} justifyContent={"center"}>
        {!outcome.cash.actual && (
          <>
            <Value secondaryValue={<Percent value={outcome.percent.min} />} title={"min"}>
              <Cash value={outcome.cash.min} fallback={0} />
            </Value>
            <Value secondaryValue={<Percent value={outcome.percent.avg} />} title={"avg"}>
              <Cash value={outcome.cash.avg} fallback={0} />
            </Value>
            <Value secondaryValue={<Percent value={outcome.percent.max} />} title={"max"}>
              <Cash value={outcome.cash.max} fallback={0} />
            </Value>
          </>
        )}
        <Value
          title={"Actual"}
          tertiaryValue={outcome.percent.actual && <Percent value={outcome.percent.actual} />}
          secondaryValue={outcome.cash.actual && <Cash value={outcome.cash.actual} />}
        >
          <Duration dateTime={payDate}>
            <Cash value={outcome.cash.actual} />
          </Duration>
        </Value>
      </Stack>
    </Box>
  );
};
