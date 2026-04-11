import { z } from "zod";

import {
  DEFAULT_DISCOVERY_TAB,
  DISCOVERY_TAB_VALUES,
  type DiscoveryTab,
} from "@/types";

const tabSchema = z.enum(DISCOVERY_TAB_VALUES);

export function parseDiscoveryTab(raw: string | null): DiscoveryTab {
  const r = tabSchema.safeParse(raw ?? "");
  return r.success ? r.data : DEFAULT_DISCOVERY_TAB;
}

export function parseCommittedQuery(searchParams: URLSearchParams): string {
  return (searchParams.get("q") ?? "").trim();
}

export function parseDiscoveryState(searchParams: URLSearchParams): {
  q: string;
  tab: DiscoveryTab;
} {
  return {
    q: parseCommittedQuery(searchParams),
    tab: parseDiscoveryTab(searchParams.get("tab")),
  };
}

/** Build the next `URLSearchParams` for discovery routing while preserving unrelated keys. */
export function applyDiscoveryQuery(
  prev: URLSearchParams,
  patch: { q?: string; tab?: DiscoveryTab },
): URLSearchParams {
  const next = new URLSearchParams(prev);

  if (patch.q !== undefined) {
    const trimmed = patch.q.trim();
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
  }

  if (patch.tab !== undefined) {
    if (patch.tab === DEFAULT_DISCOVERY_TAB) next.delete("tab");
    else next.set("tab", patch.tab);
  }

  return next;
}
