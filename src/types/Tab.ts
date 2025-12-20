export const tabs = ["model", "poses"] as const;

export type TabType = (typeof tabs)[number];
