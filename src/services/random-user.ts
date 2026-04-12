import type { User } from "@/types";

/** https://randomuser.me/documentation — public API, no key. */
function getRandomUserBaseUrl(): string {
  const url = process.env.BUN_PUBLIC_RANDOM_USER_API;
  if (!url?.trim()) {
    return "https://randomuser.me/api/";
  }
  const trimmed = url.trim();
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

type RandomUserName = { title: string; first: string; last: string };

type RandomUserRaw = {
  name: RandomUserName;
  email: string;
  cell: string;
  picture: { large: string; medium: string; thumbnail: string };
  location: { city: string; country: string; state?: string };
  login: { username: string; uuid: string };
};

type RandomUserApiPayload = {
  results: RandomUserRaw[];
  error?: string;
};

const BATCH = 100;

function nameMatchesQuery(query: string, first: string, last: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  const full = `${first} ${last}`.toLowerCase();
  if (full.includes(q)) return true;
  const parts = q.split(/\s+/).filter(Boolean);
  return parts.length > 0 && parts.every((p) => full.includes(p));
}

/**
 * Random User Generator has no text search. We fetch a batch and filter by name
 * so the UX still feels like “search” (PRD optional users source).
 * `page` maps to the API `page` param for load-more batches.
 */
export async function searchUsers(
  query: string,
  page: number = 1,
): Promise<{ users: User[]; totalCount: number }> {
  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  const params = new URLSearchParams({
    results: String(BATCH),
    page: String(Math.max(1, page)),
    inc: "name,picture,location,email,login,cell",
  });

  const response = await fetch(`${getRandomUserBaseUrl()}?${params}`);

  if (!response.ok) {
    throw new Error(
      `Random User API error: ${response.status} ${response.statusText}`,
    );
  }

  const data: RandomUserApiPayload = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  const raw = data.results ?? [];

  const filtered = raw.filter((r) =>
    nameMatchesQuery(query, r.name.first, r.name.last),
  );

  const users: User[] = filtered.map((r) => {
    const title = `${r.name.first} ${r.name.last}`.trim();
    const loc = [r.location.city, r.location.state, r.location.country]
      .filter(Boolean)
      .join(", ");

    return {
      id: r.login.uuid,
      source: "user",
      title,
      description: `${r.email} · ${loc}`,
      imageUrl: r.picture.medium,
      url: `https://randomuser.me/`,
      username: r.login.username,
      location: loc,
      email: r.email,
      phone: r.cell,
      metadata: {
        city: r.location.city,
        country: r.location.country,
      },
    };
  });

  return {
    users,
    totalCount: users.length,
  };
}
