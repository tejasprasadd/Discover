import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

import { MovieCard } from "@/features/movies/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { DiscoveryDetailSelection, Movie } from "@/types";

import { DiscoveryLoadMoreButton } from "./DiscoveryLoadMoreButton";
import { DiscoveryPlaceholderPanel } from "./DiscoveryPlaceholderPanel";
import { DiscoveryQueryErrorAlert } from "./DiscoveryQueryErrorAlert";

type MoviePage = { movies: Movie[]; totalCount: number };
type MovieInfinite = UseInfiniteQueryResult<InfiniteData<MoviePage, unknown>, Error>;

function GridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4"
      role="status"
      aria-live="polite"
      aria-busy
    >
      <span className="sr-only">Loading movies</span>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <Skeleton className="aspect-[2/3] w-full rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MovieResultsPanel({
  hasQuery,
  committedQuery,
  query,
  onOpenDetail,
}: {
  hasQuery: boolean;
  committedQuery: string;
  query: MovieInfinite;
  onOpenDetail: (selection: DiscoveryDetailSelection) => void;
}) {
  const list = useMemo(
    () => query.data?.pages.flatMap((p) => p.movies) ?? [],
    [query.data?.pages],
  );

  const totalApprox = query.data?.pages[0]?.totalCount;

  if (!hasQuery) {
    return (
      <DiscoveryPlaceholderPanel
        variant="idle"
        committedQuery={committedQuery}
        sourceLabel="Movie"
      />
    );
  }

  if (query.isPending) {
    return <GridSkeleton />;
  }

  if (query.isError) {
    return (
      <DiscoveryQueryErrorAlert
        title="Could not load movies"
        message={query.error.message}
        onRetry={() => query.refetch()}
      />
    );
  }

  if (list.length === 0) {
    return (
      <div
        className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center"
        role="status"
      >
        <p className="text-sm font-medium text-foreground">No movies found</p>
        <p className="mt-2 text-pretty text-sm text-muted-foreground">
          No OMDb results for &quot;{committedQuery}&quot;. Try another title or year.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Data from{" "}
          <a
            href="https://www.omdbapi.com/"
            className="text-primary underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            OMDb
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {typeof totalApprox === "number" ? (
        <p className="text-center text-xs text-muted-foreground md:text-left">
          Showing {list.length.toLocaleString()}
          {totalApprox > list.length
            ? ` of ${totalApprox.toLocaleString()} results`
            : " results"}
        </p>
      ) : null}

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4"
        role="list"
        aria-label="Movie search results"
      >
        {list.map((movie) => (
          <div key={String(movie.id)} role="listitem">
            <MovieCard
              movie={movie}
              onSelect={() => onOpenDetail({ source: "movie", item: movie })}
            />
          </div>
        ))}
      </div>

      {query.hasNextPage ? (
        <DiscoveryLoadMoreButton
          label="Load more movies"
          isFetching={query.isFetchingNextPage}
          onFetch={() => query.fetchNextPage()}
        />
      ) : null}
    </div>
  );
}
