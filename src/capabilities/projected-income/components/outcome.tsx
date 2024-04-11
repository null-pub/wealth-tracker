import { Box, Divider, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { CashRange } from "shared/components/formatters/cash-range";
import { Percent } from "shared/components/formatters/percent";
import { Cluster } from "../hooks/use-gradient";
import { Value } from "./value";

export const Outcome = (props: { title: ReactNode; cluster?: Cluster[]; compact?: boolean }) => {
  const { title, cluster, compact = true } = props;

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 2,
      }}
    >
      <Typography sx={{ paddingBottom: 1, paddingLeft: 2, paddingTop: 1, display: "flex" }} variant="h5">
        {title}
      </Typography>
      <Divider />

      <Stack padding={1} direction={"row"} spacing={0.5}>
        {cluster &&
          cluster.map((x, i) => {
            return (
              <Value
                key={i}
                title={
                  <Box display={"flex"} gap={1}>
                    <span>{x.title}</span>
                    {x.probability < 1 && <Percent probability={x.probability} value={x.probability} />}
                  </Box>
                }
              >
                <CashRange compact={compact} min={x.min} max={x.max} />
              </Value>
            );
          })}
      </Stack>
    </Box>
  );
};
