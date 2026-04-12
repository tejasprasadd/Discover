import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ExternalLink, Loader2, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMovieByImdbId, type OmdbMovieDetail } from "@/services/omdb";
import type { DiscoveryDetailSelection, Movie, Repository, User } from "@/types";

const movieDetailKey = (imdbID: string) => ["discovery", "movie-detail", imdbID] as const;

type DiscoveryDetailDialogProps = {
  selection: DiscoveryDetailSelection | null;
  onClose: () => void;
};

export function DiscoveryDetailDialog({ selection, onClose }: DiscoveryDetailDialogProps) {
  const open = selection !== null;

  const imdbID =
    selection?.source === "movie" ? String(selection.item.id) : "";

  const detailQuery = useQuery({
    queryKey: movieDetailKey(imdbID),
    queryFn: () => fetchMovieByImdbId(imdbID),
    enabled: open && selection?.source === "movie" && imdbID.length > 0,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        showCloseButton
        className="max-h-[min(90dvh,720px)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-y-auto p-0 sm:max-w-lg md:max-w-xl"
      >
        {selection?.source === "repository" ? (
          <RepositoryDetailBody item={selection.item} onClose={onClose} />
        ) : null}
        {selection?.source === "movie" ? (
          <MovieDetailBody
            item={selection.item}
            query={detailQuery}
            onClose={onClose}
          />
        ) : null}
        {selection?.source === "user" ? (
          <UserDetailBody item={selection.item} onClose={onClose} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function RepositoryDetailBody({
  item,
  onClose,
}: {
  item: Repository;
  onClose: () => void;
}) {
  return (
    <>
      <DialogHeader className="border-b border-border/80 px-4 py-4 sm:px-6">
        <DialogTitle className="pr-10 text-balance text-lg sm:text-xl">
          {item.title}
        </DialogTitle>
        <DialogDescription className="text-pretty">
          {item.owner} · {item.stars.toLocaleString()} stars · {item.forks.toLocaleString()} forks
          {item.language ? ` · ${item.language}` : ""}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 px-4 py-4 sm:px-6">
        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="default" size="sm">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              Open on GitHub
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </>
  );
}

function MovieDetailBody({
  item,
  query,
  onClose,
}: {
  item: Movie;
  query: UseQueryResult<OmdbMovieDetail, Error>;
  onClose: () => void;
}) {
  const d = query.data;
  const posterOk = d?.Poster && d.Poster !== "N/A";

  return (
    <>
      <DialogHeader className="border-b border-border/80 px-4 py-4 sm:px-6">
        <DialogTitle className="pr-10 text-balance text-lg sm:text-xl">
          {d?.Title ?? item.title}
        </DialogTitle>
        <DialogDescription>
          {d ? `${d.Year} · ${d.Runtime} · ${d.Rated}` : `${item.releaseDate} · movie`}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,140px)_1fr] sm:gap-6 sm:px-6">
        <div className="mx-auto w-full max-w-[160px] sm:mx-0">
          {query.isPending ? (
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          ) : posterOk ? (
            <img
              src={d!.Poster}
              alt=""
              className="w-full rounded-lg object-cover ring-1 ring-border shadow-sm"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
              No poster
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-3 text-sm">
          {query.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : query.isError ? (
            <p className="text-destructive" role="alert">
              {query.error.message}
            </p>
          ) : (
            <>
              {d?.imdbRating ? (
                <p className="inline-flex items-center gap-1.5 text-foreground">
                  <Star className="size-4 text-amber-500" aria-hidden />
                  <span className="font-medium">{d.imdbRating}</span>
                  <span className="text-muted-foreground">IMDb ({d.imdbVotes} votes)</span>
                </p>
              ) : null}
              <div className="space-y-1 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Director:</span> {d?.Director}
                </p>
                <p>
                  <span className="font-medium text-foreground">Cast:</span> {d?.Actors}
                </p>
                <p>
                  <span className="font-medium text-foreground">Genre:</span> {d?.Genre}
                </p>
              </div>
              <p className="text-pretty leading-relaxed text-foreground/90">{d?.Plot}</p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border/80 bg-muted/30 px-4 py-4 sm:px-6">
        {item.url ? (
          <Button asChild variant="default" size="sm">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              View on IMDb
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </Button>
        ) : null}
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
        {query.isFetching && !query.isPending ? (
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
            Updating…
          </span>
        ) : null}
      </div>
    </>
  );
}

function UserDetailBody({
  item,
  onClose,
}: {
  item: User;
  onClose: () => void;
}) {
  const meta = item.metadata as { city?: string; country?: string };

  return (
    <>
      <DialogHeader className="border-b border-border/80 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="size-20 shrink-0 rounded-full object-cover ring-2 ring-border"
            />
          ) : null}
          <div className="min-w-0">
            <DialogTitle className="pr-10 text-balance text-lg sm:text-xl">{item.title}</DialogTitle>
            <DialogDescription className="font-mono text-sm">@{item.username}</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="space-y-4 px-4 py-4 sm:px-6">
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{item.location}</span>
          </li>
          <li className="break-all">{item.email}</li>
          <li>{item.phone}</li>
          {(meta.city || meta.country) && (
            <li className="text-xs">
              <span className="font-medium text-foreground">Regions: </span>
              {[meta.city, meta.country].filter(Boolean).join(" · ")}
            </li>
          )}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="https://randomuser.me/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              About Random User
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </>
  );
}
