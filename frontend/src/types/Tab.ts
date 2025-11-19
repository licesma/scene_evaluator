export const tabs = ["model", "poses", "stats"] as const;

export type TabType = (typeof tabs)[number];
