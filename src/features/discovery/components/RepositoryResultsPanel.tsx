import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

import { RepositoryCard } from "@/features/repositories/components/RepositoryCard";
import { Skeleton } from "@/shadcn-components/ui/skeleton";
import type { DiscoveryDetailSelection, Repository } from "@/types";

import { DiscoveryLoadMoreButton } from "./DiscoveryLoadMoreButton";
import { DiscoveryPlaceholderPanel } from "./DiscoveryPlaceholderPanel";
import { DiscoveryQueryErrorAlert } from "./DiscoveryQueryErrorAlert";

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
      <DiscoveryQueryErrorAlert
        title="Could not load repositories"
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
        <DiscoveryLoadMoreButton
          label="Load more repositories"
          isFetching={query.isFetchingNextPage}
          onFetch={() => query.fetchNextPage()}
        />
      ) : null}
    </div>
  );
}
