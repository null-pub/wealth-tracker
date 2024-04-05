import { DateTime } from "luxon";

export const sortByDate =
  <T>(select: (data: T) => DateTime, direction: "asc" | "desc") =>
  (a: T, b: T) =>
    direction === "asc" ? select(a).toMillis() - select(b).toMillis() : select(b).toMillis() - select(a).toMillis();
