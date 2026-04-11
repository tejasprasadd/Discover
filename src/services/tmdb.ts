import type { Movie, TMDBSearchResponse } from "@/types";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w200";

function getTmdbEndpoint(): string {
  const url = import.meta.env.BUN_PUBLIC_TMDB_ENDPOINT;
  if (!url?.trim()) {
    throw new Error(
      "Missing BUN_PUBLIC_TMDB_ENDPOINT. Copy .env.example to .env and set it.",
    );
  }
  return url.trim().replace(/\/$/, "");
}

function getTmdbApiKey(): string {
  const key = import.meta.env.BUN_PUBLIC_TMDB_API_KEY;
  if (!key?.trim()) {
    throw new Error(
      "Missing BUN_PUBLIC_TMDB_API_KEY. Copy .env.example to .env and set it.",
    );
  }
  return key.trim();
}

export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<{ movies: Movie[]; totalCount: number }> {
  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  const params = new URLSearchParams({
    api_key: getTmdbApiKey(),
    query,
    page: String(page),
    include_adult: "false",
  });

  const response = await fetch(
    `${getTmdbEndpoint()}/search/movie?${params}`,
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }

  const data: TMDBSearchResponse = await response.json();

  const movies: Movie[] = data.results.map((item) => ({
    id: item.id,
    source: "movie",
    title: item.title,
    description: item.overview || "No overview available",
    posterPath: item.poster_path ?? undefined,
    imageUrl: item.poster_path
      ? `${POSTER_BASE_URL}${item.poster_path}`
      : undefined,
    rating: item.vote_average,
    releaseDate: item.release_date,
    overview: item.overview,
    popularity: item.popularity,
    url: `https://www.themoviedb.org/movie/${item.id}`,
    metadata: {
      releaseDate: item.release_date,
      popularity: item.popularity,
    },
  }));

  return {
    movies,
    totalCount: data.total_results,
  };
}
