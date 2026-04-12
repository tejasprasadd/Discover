import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useMemo } from "react";

import { UserCard } from "@/features/users/components/UserCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DiscoveryDetailSelection, User } from "@/types";

import { DiscoveryPlaceholderPanel } from "./DiscoveryPlaceholderPanel";

type UserPage = { users: User[]; totalCount: number };
type UserInfinite = UseInfiniteQueryResult<InfiniteData<UserPage, unknown>, Error>;

function dedupeUsers(pages: UserPage[]): User[] {
  const seen = new Set<string>();
  const out: User[] = [];
  for (const p of pages) {
    for (const u of p.users) {
      const k = String(u.id);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(u);
      }
    }
  }
  return out;
}

function GridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-live="polite"
      aria-busy
    >
      <span className="sr-only">Loading users</span>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-border/60 bg-card p-4">
          <Skeleton className="size-14 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function UserResultsPanel({
  hasQuery,
  committedQuery,
  query,
  onOpenDetail,
}: {
  hasQuery: boolean;
  committedQuery: string;
  query: UserInfinite;
  onOpenDetail: (selection: DiscoveryDetailSelection) => void;
}) {
  const list = useMemo(
    () => (query.data?.pages ? dedupeUsers(query.data.pages) : []),
    [query.data?.pages],
  );

  if (!hasQuery) {
    return (
      <DiscoveryPlaceholderPanel
        variant="idle"
        committedQuery={committedQuery}
        sourceLabel="User"
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
        <AlertTitle>Could not load users</AlertTitle>
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{query.error.message}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (list.length === 0 && !query.hasNextPage) {
    return (
      <div
        className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center"
        role="status"
      >
        <p className="text-sm font-medium text-foreground">No matching profiles</p>
        <p className="mt-2 text-pretty text-sm text-muted-foreground">
          Random User returns synthetic names — try a short first or last name (e.g. &quot;john&quot;, &quot;anna&quot;).
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          <a
            href="https://randomuser.me/documentation"
            className="text-primary underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            API documentation
          </a>
        </p>
      </div>
    );
  }

  if (list.length === 0 && query.hasNextPage) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
        <div role="status">
          <p className="text-sm font-medium text-foreground">No matches in this batch</p>
          <p className="mt-2 max-w-md text-pretty text-sm text-muted-foreground">
            Try loading another batch of random profiles, or refine your search term.
          </p>
        </div>
        <Button
          type="button"
          variant="default"
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
            "Load another batch"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-xs text-muted-foreground md:text-left">
        {list.length} unique profile{list.length === 1 ? "" : "s"} matching &quot;{committedQuery}&quot;
      </p>

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="User search results"
      >
        {list.map((user) => (
          <div key={String(user.id)} role="listitem">
            <UserCard
              user={user}
              onSelect={() => onOpenDetail({ source: "user", item: user })}
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
              "Load more profiles"
            )}
          </Button>
          <p className="max-w-md text-center text-[11px] text-muted-foreground">
            Each batch fetches new random profiles; matches are filtered client-side.
          </p>
        </div>
      ) : null}
    </div>
  );
}
