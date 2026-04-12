import { GitFork, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Repository } from "@/types";
import { cn } from "@/lib/utils";

type RepositoryCardProps = {
  repository: Repository;
  onSelect: () => void;
  className?: string;
};

export function RepositoryCard({ repository, onSelect, className }: RepositoryCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full min-w-0 rounded-xl text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        className,
      )}
    >
      <Card size="sm" className="h-full shadow-none">
        <CardHeader className="gap-1 pb-2">
          <CardTitle className="line-clamp-2 text-base leading-snug text-primary">
            {repository.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{repository.owner}</p>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <p className="line-clamp-3 text-muted-foreground">{repository.description}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 shrink-0 text-amber-500" aria-hidden />
              {repository.stars.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitFork className="size-3.5 shrink-0" aria-hidden />
              {repository.forks.toLocaleString()}
            </span>
            {repository.language ? (
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                {repository.language}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
