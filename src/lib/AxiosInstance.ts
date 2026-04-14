import axios from "axios";

const timeout = 15_000;

function githubBaseUrl(): string {
  const raw = process.env.BUN_PUBLIC_GITHUB_ENDPOINT;
  if (!raw?.trim()) return "https://api.github.com";
  try {
    const u = new URL(raw.trim());
    return `${u.protocol}//${u.host}`;
  } catch {
    return raw.trim();
  }
}

function omdbBaseUrl(): string {
  const raw = process.env.BUN_PUBLIC_OMDB_ENDPOINT ?? "https://www.omdbapi.com";
  return raw.trim().replace(/\/$/, "");
}

function randomUserBaseUrl(): string {
  const raw = process.env.BUN_PUBLIC_RANDOM_USER_API ?? "https://randomuser.me/api/";
  const trimmed = raw.trim();
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

export const AxiosInstanceGitHub = axios.create({
  baseURL: githubBaseUrl(),
  timeout,
});

export const AxiosInstanceOmdb = axios.create({
  baseURL: omdbBaseUrl(),
  timeout,
});

export const AxiosInstanceRandomUser = axios.create({
  baseURL: randomUserBaseUrl(),
  timeout,
});