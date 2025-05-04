import { z } from "zod";

export const ratings = {
  outstanding: "OUTSTANDING",
  exceedsExpectations: "EXCEEDS_EXPECTATIONS",
  meetsExpectations: "MEETS_EXPECTATIONS",
  doesNotMeetExpectations: "DOES_NOT_MEET_EXPECTATIONS",
} as const;

export const ratingsLabels = {
  [ratings.outstanding]: "Outstanding",
  [ratings.exceedsExpectations]: "Exceeds Expectations",
  [ratings.meetsExpectations]: "Meets Expectations",
  [ratings.doesNotMeetExpectations]: "Does Not Meet Expectations",
} as const;

export const ratingPoints = {
  [ratings.exceedsExpectations]: 3,
  [ratings.meetsExpectations]: 2,
  [ratings.doesNotMeetExpectations]: 1,
  [ratings.outstanding]: 4,
} as const;

export type Rating = (typeof ratings)[keyof typeof ratings];

export const accountDataValidator = z.object({
  date: z.string(),
  value: z.number(),
});

export type AccountData = z.infer<typeof accountDataValidator>;

export const meritData = z.object({
  date: z.string(),
  meritIncreasePct: z.number(),
  meritBonusPct: z.number(),
  equityPct: z.number(),
  rating: z.nativeEnum(ratings).optional(),
  enabled: z.boolean(),
});
export type MeritData = z.infer<typeof meritData>;
