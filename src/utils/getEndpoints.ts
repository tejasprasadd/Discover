export function getGithubEndpoint(): string {
    const url = process.env.BUN_PUBLIC_GITHUB_ENDPOINT;
    if (!url?.trim()) {
      throw new Error(
        "Missing BUN_PUBLIC_GITHUB_ENDPOINT. Copy .env.example to .env and set it.",
      );
    }
    return url.trim();
  }
  
  export function getGithubPat(): string | undefined {
    const pat = process.env.BUN_PUBLIC_GITHUB_PAT;
    return pat?.trim() || undefined;
  }

  export function getOmdbEndpoint(): string {
    const url = process.env.BUN_PUBLIC_OMDB_ENDPOINT;
    if (!url?.trim()) {
      throw new Error(
        "Missing BUN_PUBLIC_OMDB_ENDPOINT. Copy .env.example to .env and set it (e.g. https://www.omdbapi.com).",
      );
    }
    return url.trim().replace(/\/$/, "");
  }
  
 export function getOmdbApiKey(): string {
    const key = process.env.BUN_PUBLIC_OMDB_API_KEY;
    if (!key?.trim()) {
      throw new Error(
        "Missing BUN_PUBLIC_OMDB_API_KEY. Copy .env.example to .env and set it.",
      );
    }
    return key.trim();
  }

  /** https://randomuser.me/documentation — public API, no key. */
export function getRandomUserBaseUrl(): string {
    const url = process.env.BUN_PUBLIC_RANDOM_USER_API;
    if (!url?.trim()) {
      return "https://randomuser.me/api/";
    }
    const trimmed = url.trim();
    return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
  }
  