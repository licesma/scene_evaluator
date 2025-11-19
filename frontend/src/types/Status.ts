export const status = {
  all: "All",
  pending: "Pending",
  object: "Wrong objects",
  pose: "Wrong pose",
  approved: "Approved",
} as const;

export type StatusType = keyof typeof status;
