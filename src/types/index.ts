/** URL / UI tab identifiers for discovery (kept in sync with `?tab=`). */
export const DISCOVERY_TAB_VALUES = ["repositories", "movies", "users"] as const;
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

export interface User extends SearchResult {
  source: "user";
  username: string;
  location: string;
  email: string;
  phone: string;
}

/** Item opened in the discovery detail modal. */
export type DiscoveryDetailSelection =
  | { source: "repository"; item: Repository }
  | { source: "movie"; item: Movie }
  | { source: "user"; item: User };

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

/** Raw OMDB search payload (`s=`). */
export interface OmdbSearchResponse {
  Search?: Array<{
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }>;
  totalResults?: string;
  Response: string;
  Error?: string;
}

export interface QueryState {
  query: string;
  page: number;
  activeTab: DiscoveryTab;
}

export type RandomUserName = { title: string; first: string; last: string };

export type RandomUserRaw = {
  name: RandomUserName;
  email: string;
  cell: string;
  picture: { large: string; medium: string; thumbnail: string };
  location: { city: string; country: string; state?: string };
  login: { username: string; uuid: string };
};

export type RandomUserApiPayload = {
  results: RandomUserRaw[];
  error?: string;
};


/** OMDb `i=` response — used for detail view (plot, cast, ratings). */
export type OmdbMovieDetail = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Poster: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  Response: string;
  Error?: string;
};