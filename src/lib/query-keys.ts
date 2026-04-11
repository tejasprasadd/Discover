/** Stable TanStack Query keys for discovery sources (per PRD: cache per tab + query). */
export const discoveryKeys = {
  all: ["discovery"] as const,
  repositories: (query: string) =>
    [...discoveryKeys.all, "repositories", query] as const,
  movies: (query: string) => [...discoveryKeys.all, "movies", query] as const,
  users: (query: string) => [...discoveryKeys.all, "users", query] as const,
};
