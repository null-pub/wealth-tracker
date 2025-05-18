import { Card, CardContent, CardHeader } from "@mui/material";
import { Stack } from "@mui/system";
import { Ratings } from "shared/models/store/current";
import { setPerformanceConfig } from "shared/store/set-performance-config";
import { ConfigEntry } from "./config-entry";

interface PerfConfigProps {
  rating: Ratings;
}

const labels = {
  didNotMeet: "Did Not Meet Expectations",
  meetsExpectations: "Meets Expectations",
  exceedsExpectations: "Exceeds Expectations",
  outstanding: "Outstanding",
};

const PerfConfig = ({ rating }: PerfConfigProps) => {
  return (
    <Stack direction="row" spacing={2} width="100%" sx={{ "& > *": { flex: 1 } }}>
      <ConfigEntry
        getStore={(x) => x.projectedIncome.config[rating].meritIncreasePct ?? 0}
        setStore={(value) => {
          setPerformanceConfig(rating, "meritIncreasePct", value);
        }}
        label={`${labels[rating]} Merit Increase`}
        variant="percent"
      />
      <ConfigEntry
        getStore={(x) => x.projectedIncome.config[rating].bonusPct ?? 0}
        setStore={(value) => {
          setPerformanceConfig(rating, "bonusPct", value);
        }}
        label={`${labels[rating]} Bonus`}
        variant="percent"
      />
    </Stack>
  );
};

export const PerformanceConfig = () => {
  return (
    <Card>
      <CardHeader title="Performance Based Increases" />
      <CardContent>
        <Stack spacing={2}>
          <PerfConfig rating={"didNotMeet"} />
          <PerfConfig rating={"meetsExpectations"} />
          <PerfConfig rating={"exceedsExpectations"} />
          <PerfConfig rating={"outstanding"} />
        </Stack>
      </CardContent>
    </Card>
  );
};
