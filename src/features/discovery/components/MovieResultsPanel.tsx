import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useMemo } from "react";

import { MovieCard } from "@/features/movies/components/MovieCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DiscoveryDetailSelection, Movie } from "@/types";

import { DiscoveryPlaceholderPanel } from "./DiscoveryPlaceholderPanel";

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
      <Alert variant="destructive" role="alert">
        <AlertCircle className="size-4" />
        <AlertTitle>Could not load movies</AlertTitle>
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{query.error.message}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
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
        <div className="flex flex-col items-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-w-[200px]"
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
          >
            {query.isFetchingNextPage ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Loading…
              </>
            ) : (
              "Load more movies"
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
