export const weeks = {
  all: "All",
  week_0: "Week 0 (12 oct)",
  week_1: "Week 1 (19 oct)",
  week_2: "Week 2 (26 oct)",
  week_3: "Week 3 (2 nov)",
  week_4: "Week 4 (9 nov)",
  week_5: "Week 5 (16 nov)",
  week_6: "Week 6 (23 nov)",
  week_7: "Week 7 (30 nov)",
  week_8: "Week 8 (7 dec)",
  week_9: "Week 9 (14 dec)",
  week_10: "Week 10 (21 dec)",
  week_11: "Week 11 (28 dec)",
  week_12: "Week 12 (4 jan)",
} as const;

export type WeekType = keyof typeof weeks;
