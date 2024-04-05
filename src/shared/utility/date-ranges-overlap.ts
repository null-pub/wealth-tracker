import { DateTime } from "luxon";

export function DateRangesOverlap(a: { start: DateTime; end: DateTime }, b: { start: DateTime; end: DateTime }) {
  return a.start <= b.end && b.start <= a.end;
}
