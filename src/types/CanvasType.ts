export const canvas = ["model", "poses"] as const;

export type CanvasType = (typeof canvas)[number];
