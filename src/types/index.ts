/** URL / UI tab identifiers for discovery (kept in sync with `?tab=`). */
export const DISCOVERY_TAB_VALUES = ["repositories", "movies"] as const;
export type DiscoveryTab = (typeof DISCOVERY_TAB_VALUES)[number];
export const DEFAULT_DISCOVERY_TAB: DiscoveryTab = "repositories";

/** Shared result shape across discovery sources */
export interface SearchResult {
  id: string | number;
  source: "repository" | "movie" | "user";
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  metadata: Record<string, unknown>;
}

export interface Repository extends SearchResult {
  source: "repository";
  owner: string;
  stars: number;
  forks: number;
  language?: string;
  url: string;
  avatarUrl: string;
}

export interface Movie extends SearchResult {
  source: "movie";
  posterPath?: string;
  rating: number;
  releaseDate: string;
  overview: string;
  popularity: number;
}

export interface GitHubSearchResponse {
  items: Array<{
    id: number;
    full_name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language?: string | null;
    html_url: string;
    owner: {
      login: string;
      avatar_url: string;
    };
  }>;
  total_count: number;
}

export interface TMDBSearchResponse {
  results: Array<{
    id: number;
    title: string;
    poster_path?: string | null;
    vote_average: number;
    release_date: string;
    overview: string;
    popularity: number;
  }>;
  total_results: number;
}

export interface QueryState {
  query: string;
  page: number;
  activeTab: DiscoveryTab;
}
