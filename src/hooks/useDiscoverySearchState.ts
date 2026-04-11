import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { applyDiscoveryQuery, parseDiscoveryState } from "@/lib/discovery-url";
import type { DiscoveryTab } from "@/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const QUERY_DEBOUNCE_MS = 350;

export function useDiscoverySearchState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { q: committedQuery, tab } = useMemo(
    () => parseDiscoveryState(searchParams),
    [searchParams],
  );

  const [draft, setDraft] = useState(committedQuery);

  useEffect(() => {
    setDraft(committedQuery);
  }, [committedQuery]);

  const debouncedDraft = useDebouncedValue(draft, QUERY_DEBOUNCE_MS);

  useEffect(() => {
    const next = debouncedDraft.trim();
    if (next === committedQuery) return;
    setSearchParams(
      (prev) => applyDiscoveryQuery(prev, { q: debouncedDraft }),
      { replace: true },
    );
  }, [debouncedDraft, committedQuery, setSearchParams]);

  const commitSearchNow = useCallback(() => {
    setSearchParams((prev) => applyDiscoveryQuery(prev, { q: draft }), {
      replace: true,
    });
  }, [draft, setSearchParams]);

  const setTab = useCallback(
    (nextTab: DiscoveryTab) => {
      setSearchParams((prev) => applyDiscoveryQuery(prev, { tab: nextTab }), {
        replace: true,
      });
    },
    [setSearchParams],
  );

  return {
    /** Input text (may differ from URL while typing). */
    draft,
    setDraft,
    /** Normalized query from the URL — single source of truth for fetching. */
    committedQuery,
    tab,
    setTab,
    /** Flush current draft to the URL immediately (Enter / search button). */
    commitSearchNow,
  };
}
