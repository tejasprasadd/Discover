import type { Movie, OmdbSearchResponse, OmdbMovieDetail } from "@/types";
import { getOmdbApiKey } from "@/utils/getEndpoints";
import { Environment, getAxiosInstance, getParamsWithConfig } from "@/lib/AxiosSetup";

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

  let data: OmdbSearchResponse;
  try {
    const client = getAxiosInstance(Environment.OMDB);
    const res = await client.get<OmdbSearchResponse>(
      "/",
      getParamsWithConfig(params),
    );
    data = res.data;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown OMDB API error";
    throw new Error(`OMDB API error: ${message}`);
  }

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
        "",
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

  let data: OmdbMovieDetail;
  try {
    const client = getAxiosInstance(Environment.OMDB);
    const res = await client.get<OmdbMovieDetail>(
      "/",
      getParamsWithConfig(params),
    );
    data = res.data;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown OMDB API error";
    throw new Error(`OMDB API error: ${message}`);
  }

  if (data.Response === "False" || data.Error) {
    throw new Error(data.Error ?? "Movie not found");
  }

  return data;
}
