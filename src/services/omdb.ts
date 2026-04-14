import type { Movie, OmdbSearchResponse, OmdbMovieDetail } from "@/types";
import { getOmdbEndpoint, getOmdbApiKey } from "@/utils/getEndpoints";
import { http } from "@/lib/http";

export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<{ movies: Movie[]; totalCount: number }> {
  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  const params = new URLSearchParams({
    apikey: getOmdbApiKey(),
    s: query.trim(),
    page: String(page),
    type: "movie",
  });

  const response = await fetch(`${getOmdbEndpoint()}/?${params}`);

  if (!response.ok) {
    throw new Error(`OMDB API error: ${response.status} ${response.statusText}`);
  }

  const data: OmdbSearchResponse = await response.json();

  if (data.Response === "False" || !data.Search?.length) {
    return {
      movies: [],
      totalCount: 0,
    };
  }

  const total = Number.parseInt(data.totalResults ?? "0", 10);

  const movies: Movie[] = data.Search.map((item) => {
    const posterOk = item.Poster && item.Poster !== "N/A";
    return {
      id: item.imdbID,
      source: "movie",
      title: item.Title,
      description: `${item.Title} (${item.Year})`,
      posterPath: posterOk ? item.Poster : undefined,
      imageUrl: posterOk ? item.Poster : undefined,
      rating: 0,
      releaseDate: item.Year,
      overview:
        "Plot is not included in OMDB search results; open IMDb for full details.",
      popularity: 0,
      url: `https://www.imdb.com/title/${item.imdbID}/`,
      metadata: {
        imdbID: item.imdbID,
        year: item.Year,
        type: item.Type,
      },
    };
  });

  return {
    movies,
    totalCount: Number.isFinite(total) ? total : movies.length,
  };
}



export async function fetchMovieByImdbId(imdbID: string): Promise<OmdbMovieDetail> {
  if (!imdbID.trim()) {
    throw new Error("imdbID is required");
  }

  const params = new URLSearchParams({
    apikey: getOmdbApiKey(),
    i: imdbID.trim(),
    plot: "full",
  });

  const response = await fetch(`${getOmdbEndpoint()}/?${params}`);

  if (!response.ok) {
    throw new Error(`OMDB API error: ${response.status} ${response.statusText}`);
  }

  const data: OmdbMovieDetail = await response.json();

  if (data.Response === "False" || data.Error) {
    throw new Error(data.Error ?? "Movie not found");
  }

  return data;
}
