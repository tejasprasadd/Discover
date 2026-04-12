import { useInfiniteQuery } from "@tanstack/react-query";

import { discoveryKeys } from "@/lib/query-keys";
import { searchRepositories } from "@/services/github";
import { searchMovies } from "@/services/omdb";
import { searchUsers } from "@/services/random-user";

const GITHUB_PER_PAGE = 20;
const OMDB_PER_PAGE = 10;
const RANDOM_USER_MAX_PAGES = 8;

/**
 * GitHub, OMDB, and Random User fetches when `committedQuery` is non-empty.
 * Each tab uses infinite query + load more; TanStack Query keeps pages when switching tabs.
 */
export function useDiscoverySourceQueries(committedQuery: string) {
  const enabled = committedQuery.trim().length > 0;

  const repositories = useInfiniteQuery({
    queryKey: discoveryKeys.repositories(committedQuery),
    queryFn: ({ pageParam }) =>
      searchRepositories(committedQuery, pageParam, GITHUB_PER_PAGE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.repositories.length < GITHUB_PER_PAGE) return undefined;
      const loaded = allPages.reduce(
        (sum, p) => sum + p.repositories.length,
        0,
      );
      if (loaded >= lastPage.totalCount) return undefined;
      return allPages.length + 1;
    },
    enabled,
  });

  const movies = useInfiniteQuery({
    queryKey: discoveryKeys.movies(committedQuery),
    queryFn: ({ pageParam }) => searchMovies(committedQuery, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.movies.length === 0) return undefined;
      if (lastPage.movies.length < OMDB_PER_PAGE) return undefined;
      const loaded = allPages.reduce((sum, p) => sum + p.movies.length, 0);
      if (loaded >= lastPage.totalCount) return undefined;
      return allPages.length + 1;
    },
    enabled,
  });

  const users = useInfiniteQuery({
    queryKey: discoveryKeys.users(committedQuery),
    queryFn: ({ pageParam }) => searchUsers(committedQuery, pageParam),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, allPages) => {
      if (allPages.length >= RANDOM_USER_MAX_PAGES) return undefined;
      return allPages.length + 1;
    },
    enabled,
  });

  return { repositories, movies, users };
}
