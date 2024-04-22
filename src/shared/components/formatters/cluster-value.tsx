import { Box } from "@mui/material";
import { DateTime } from "luxon";
import { CashRange } from "shared/components/formatters/cash-range";
import { Percent } from "shared/components/formatters/percent";
import { PercentRange } from "shared/components/formatters/percent-range";
import { Value } from "shared/components/formatters/value";
import { Cluster } from "shared/hooks/use-clusters";

interface ClusterValueProps extends Cluster {
  compact?: boolean;
}

const ClusterValue = (props: ClusterValueProps) => {
  const { min, max, probability, title, compact } = props;
  return (
    <Value
      title={
        <Box display={"flex"} gap={1}>
          <span>{title}</span>
          {probability < 1 && probability >= 0 && <Percent probability={probability} value={probability} />}
        </Box>
      }
    >
      {min < 1 && min > 0 && <PercentRange min={min} max={max} />}
      {min > 1 && <CashRange compact={compact} min={min} max={max} />}
      {min === 0 && 0}
    </Value>
  );
};

export const ClusterValues = (props: { clusters?: Cluster[]; eventDate?: DateTime; compact?: boolean }) => {
  const { clusters, eventDate, compact = true } = props;
  return clusters?.map((x, i, arr) => {
    const title = arr.length === 1 && (eventDate?.diffNow().toMillis() ?? -1) > 0 ? "Expected" : x.title;
    return <ClusterValue {...x} title={title} compact={compact} key={i} />;
  });
};
