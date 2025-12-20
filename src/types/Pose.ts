export const pose = {
  pending: "Pending",
  wrong: "Wrong",
  almost: "Almost",
  approved: "Approved",
} as const;

export type PoseType = keyof typeof pose;
