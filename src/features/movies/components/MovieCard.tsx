import { Calendar, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Movie } from "@/types";
import { cn } from "@/lib/utils";

type MovieCardProps = {
  movie: Movie;
  className?: string;
};

export function MovieCard({ movie, className }: MovieCardProps) {
  return (
    <Card size="sm" className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
      <div className="relative aspect-[2/3] w-full bg-muted">
        {movie.imageUrl ? (
          <img
            src={movie.imageUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            No poster
          </div>
        )}
      </div>
      <CardHeader className="gap-1 pb-2">
        <CardTitle className="line-clamp-2 text-base leading-snug">
          {movie.url ? (
            <a
              href={movie.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {movie.title}
            </a>
          ) : (
            movie.title
          )}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" aria-hidden />
            {movie.releaseDate}
          </span>
          {movie.rating > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 text-amber-500" aria-hidden />
              {movie.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="line-clamp-3 text-muted-foreground">{movie.overview}</p>
      </CardContent>
    </Card>
  );
}
