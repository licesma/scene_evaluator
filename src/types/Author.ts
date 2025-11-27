export const authors = ["all", "esteban", "junsoo", "divleen"] as const;

export type AuthorType = (typeof authors)[number];
