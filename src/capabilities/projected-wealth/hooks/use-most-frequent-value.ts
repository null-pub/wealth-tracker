import { useMemo } from "react";
import { AccountData } from "shared/models/account-data";

export const useMostFrequentValue = (data: AccountData[]): number | undefined => {
  return useMemo(() => {
    return Object.entries(
      Object.groupBy(
        data.map((x) => x.value),
        (x) => x
      )
    )
      .map(([key, values]) => [+key, values?.length ?? 0])
      .sort(([, a], [, b]) => {
        return b - a;
      })[0]?.[0];
  }, [data]);
};
