import type { User } from "@/types";
import { getRandomUserBaseUrl } from "@/utils/getEndpoints";
import type { RandomUserApiPayload } from "@/types";
import { BATCH, nameMatchesQuery } from "@/utils/random-user-helpers";
import { Environment, getAxiosInstance, getParamsWithConfig } from "@/lib/AxiosSetup";

/**
 * Random User Generator has no text search. We fetch a batch and filter by name
 * so the UX still feels like “search”.
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

  let data: RandomUserApiPayload;
  try {
    const client = getAxiosInstance(Environment.RANDOM_USER);
    // Random User baseURL already points at `/api/`, so path is empty.
    const res = await client.get<RandomUserApiPayload>(
      "",
      getParamsWithConfig(params),
    );
    data = res.data;
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unknown Random User API error";
    throw new Error(`Random User API error: ${message}`);
  }

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
