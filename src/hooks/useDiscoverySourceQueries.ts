import { useQuery } from "@tanstack/react-query";

import { discoveryKeys } from "@/lib/query-keys";
import { searchRepositories } from "@/services/github";
import { searchMovies } from "@/services/omdb";
import { searchUsers } from "@/services/random-user";

/**
 * Runs GitHub, OMDB, and Random User fetches in parallel when `committedQuery` is non-empty.
 * TanStack Query retains each tab’s data when switching tabs (stale time from query client).
 */
export function useDiscoverySourceQueries(committedQuery: string) {
  const enabled = committedQuery.trim().length > 0;

  const repositories = useQuery({
    queryKey: discoveryKeys.repositories(committedQuery),
    queryFn: () => searchRepositories(committedQuery),
    enabled,
  });

  const movies = useQuery({
    queryKey: discoveryKeys.movies(committedQuery),
    queryFn: () => searchMovies(committedQuery),
    enabled,
  });

  const users = useQuery({
    queryKey: discoveryKeys.users(committedQuery),
    queryFn: () => searchUsers(committedQuery),
    enabled,
  });

  return { repositories, movies, users };
}
