import type { UseQueryResult } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { RepositoryCard } from "@/features/repositories/components/RepositoryCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Repository } from "@/types";

import { DiscoveryPlaceholderPanel } from "./DiscoveryPlaceholderPanel";

type RepoQuery = UseQueryResult<
  { repositories: Repository[]; totalCount: number },
  Error
>;

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
}: {
  hasQuery: boolean;
  committedQuery: string;
  query: RepoQuery;
}) {
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
      <Alert variant="destructive">
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

  const list = query.data?.repositories ?? [];
  if (list.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        No repositories matched &quot;{committedQuery}&quot;. Try another query.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map((repo) => (
        <RepositoryCard key={String(repo.id)} repository={repo} />
      ))}
    </div>
  );
}
