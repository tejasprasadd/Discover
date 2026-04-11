import type { UseQueryResult } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { MovieCard } from "@/features/movies/components/MovieCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie } from "@/types";

import { DiscoveryPlaceholderPanel } from "./DiscoveryPlaceholderPanel";

type MovieQuery = UseQueryResult<{ movies: Movie[]; totalCount: number }, Error>;

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
}: {
  hasQuery: boolean;
  committedQuery: string;
  query: MovieQuery;
}) {
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
      <Alert variant="destructive">
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

  const list = query.data?.movies ?? [];
  if (list.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        No movies found for &quot;{committedQuery}&quot; via{" "}
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
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {list.map((movie) => (
        <MovieCard key={String(movie.id)} movie={movie} />
      ))}
    </div>
  );
}
