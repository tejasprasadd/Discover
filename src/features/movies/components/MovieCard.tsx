import { Calendar, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn-components/ui/card";
import type { Movie } from "@/types";
import { cn } from "@/lib/utils";

type MovieCardProps = {
  movie: Movie;
  onSelect: () => void;
  className?: string;
};

export function MovieCard({ movie, onSelect, className }: MovieCardProps) {
  const [imageOk, setImageOk] = useState(Boolean(movie.imageUrl));

  useEffect(() => {
    setImageOk(Boolean(movie.imageUrl));
  }, [movie.imageUrl]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full min-w-0 rounded-xl text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        className,
      )}
    >
      <Card size="sm" className="h-full overflow-hidden shadow-none">
        <div className="relative aspect-[2/3] w-full bg-muted">
          {movie.imageUrl && imageOk ? (
            <img
              src={movie.imageUrl}
              alt=""
              className="size-full object-cover"
              onError={() => setImageOk(false)}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              No poster
            </div>
          )}
        </div>
        <CardHeader className="gap-1 pb-2">
          <CardTitle className="line-clamp-2 text-base leading-snug text-primary">{movie.title}</CardTitle>
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
    </button>
  );
}
