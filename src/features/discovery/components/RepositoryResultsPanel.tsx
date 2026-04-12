import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useMemo } from "react";

import { RepositoryCard } from "@/features/repositories/components/RepositoryCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DiscoveryDetailSelection, Repository } from "@/types";

import { DiscoveryPlaceholderPanel } from "./DiscoveryPlaceholderPanel";

type RepoPage = { repositories: Repository[]; totalCount: number };
type RepoInfinite = UseInfiniteQueryResult<InfiniteData<RepoPage, unknown>, Error>;

function GridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-live="polite"
      aria-busy
    >
      <span className="sr-only">Loading repositories</span>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/60 bg-card p-4">
          <Skeleton className="mb-2 h-5 w-3/4" />
          <Skeleton className="mb-3 h-3 w-1/3" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

export function RepositoryResultsPanel({
  hasQuery,
  committedQuery,
  query,
  onOpenDetail,
}: {
  hasQuery: boolean;
  committedQuery: string;
  query: RepoInfinite;
  onOpenDetail: (selection: DiscoveryDetailSelection) => void;
}) {
  const list = useMemo(
    () => query.data?.pages.flatMap((p) => p.repositories) ?? [],
    [query.data?.pages],
  );

  const totalApprox = query.data?.pages[0]?.totalCount;

  if (!hasQuery) {
    return (
      <DiscoveryPlaceholderPanel
        variant="idle"
        committedQuery={committedQuery}
        sourceLabel="Repository"
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
        <AlertTitle>Could not load repositories</AlertTitle>
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
        <p className="text-sm font-medium text-foreground">No repositories found</p>
        <p className="mt-2 text-pretty text-sm text-muted-foreground">
          Nothing matched &quot;{committedQuery}&quot;. Try different keywords or check spelling.
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
            ? ` of about ${totalApprox.toLocaleString()} results`
            : " results"}
        </p>
      ) : null}

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Repository search results"
      >
        {list.map((repo) => (
          <div key={String(repo.id)} role="listitem">
            <RepositoryCard
              repository={repo}
              onSelect={() => onOpenDetail({ source: "repository", item: repo })}
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
              "Load more repositories"
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
