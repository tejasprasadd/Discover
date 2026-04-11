import type { UseQueryResult } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { UserCard } from "@/features/users/components/UserCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/types";

import { DiscoveryPlaceholderPanel } from "./DiscoveryPlaceholderPanel";

type UserQuery = UseQueryResult<{ users: User[]; totalCount: number }, Error>;

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
}: {
  hasQuery: boolean;
  committedQuery: string;
  query: UserQuery;
}) {
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
      <Alert variant="destructive">
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

  const list = query.data?.users ?? [];
  if (list.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        No generated users matched &quot;{committedQuery}&quot; in this batch.{" "}
        <a
          href="https://randomuser.me/documentation"
          className="text-primary underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Random User
        </a>{" "}
        returns synthetic names — try a short first or last name (e.g. &quot;john&quot;, &quot;anna&quot;).
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map((user) => (
        <UserCard key={String(user.id)} user={user} />
      ))}
    </div>
  );
}
