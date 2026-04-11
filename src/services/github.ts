import type { GitHubSearchResponse, Repository } from "@/types";

function getGithubEndpoint(): string {
  const url = import.meta.env.BUN_PUBLIC_GITHUB_ENDPOINT;
  if (!url?.trim()) {
    throw new Error(
      "Missing BUN_PUBLIC_GITHUB_ENDPOINT. Copy .env.example to .env and set it.",
    );
  }
  return url.trim();
}

function getGithubPat(): string | undefined {
  const pat = import.meta.env.BUN_PUBLIC_GITHUB_PAT;
  return pat?.trim() || undefined;
}

export async function searchRepositories(
  query: string,
  page: number = 1,
  perPage: number = 20,
): Promise<{ repositories: Repository[]; totalCount: number }> {
  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  const params = new URLSearchParams({
    q: query,
    page: String(page),
    per_page: String(perPage),
    sort: "stars",
    order: "desc",
  });

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const pat = getGithubPat();
  if (pat) {
    (headers as Record<string, string>).Authorization = `Bearer ${pat}`;
  }

  const response = await fetch(`${getGithubEndpoint()}?${params}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data: GitHubSearchResponse = await response.json();

  const repositories: Repository[] = data.items.map((item) => ({
    id: item.id,
    source: "repository",
    title: item.full_name,
    description: item.description ?? "No description",
    owner: item.owner.login,
    stars: item.stargazers_count,
    forks: item.forks_count,
    language: item.language ?? undefined,
    url: item.html_url,
    avatarUrl: item.owner.avatar_url,
    imageUrl: item.owner.avatar_url,
    metadata: {
      fullName: item.full_name,
      language: item.language,
    },
  }));

  return {
    repositories,
    totalCount: data.total_count,
  };
}
