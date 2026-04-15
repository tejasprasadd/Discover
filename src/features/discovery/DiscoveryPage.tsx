import { useRef, useState } from "react";

import { AppShell } from "@/shadcn-components/layout/AppShell";
import { PageSection } from "@/shadcn-components/layout/PageSection";
import { DiscoveryDetailDialog } from "@/features/discovery/components/DiscoveryDetailDialog";
import { DiscoveryTabsPanel } from "@/features/discovery/components/DiscoveryTabsPanel";
import { MovieResultsPanel } from "@/features/discovery/components/MovieResultsPanel";
import { RepositoryResultsPanel } from "@/features/discovery/components/RepositoryResultsPanel";
import { UserResultsPanel } from "@/features/discovery/components/UserResultsPanel";
import { SpotlightSearchBar } from "@/features/search/components/SpotlightSearchBar";
import { useDiscoverySearchState } from "@/hooks/useDiscoverySearchState";
import { useDiscoverySourceQueries } from "@/hooks/useDiscoverySourceQueries";
import { useSpotlightFocusShortcut } from "@/hooks/useSpotlightFocusShortcut";
import type { DiscoveryDetailSelection } from "@/types";

export function DiscoveryPage() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  useSpotlightFocusShortcut(searchInputRef);

  const [detailSelection, setDetailSelection] = useState<DiscoveryDetailSelection | null>(null);

  const {
    draft,
    setDraft,
    committedQuery,
    tab,
    setTab,
    commitSearchNow,
  } = useDiscoverySearchState();

  const hasQuery = committedQuery.length > 0;
  const queries = useDiscoverySourceQueries(committedQuery);

  const searchBusy =
    hasQuery &&
    (queries.repositories.isPending ||
      queries.movies.isPending ||
      queries.users.isPending);

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-muted/50 via-background to-background"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent"
        aria-hidden
      />

      <AppShell
        stickyHeader={true}
        header={
          <PageSection className="pb-4 pt-12 sm:pb-6 sm:pt-16">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Discover
              </p>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Search once. Browse everything.
              </h1>
              <p className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                GitHub repositories, OMDb movies, and Random User profiles — one query, URL-synced state, and
                per-tab caching so switching tabs keeps your results.
              </p>
              <div className="mt-10 w-full">
                <SpotlightSearchBar
                  ref={searchInputRef}
                  value={draft}
                  onValueChange={setDraft}
                  onSubmitSearch={commitSearchNow}
                  isBusy={searchBusy}
                />
              </div>
            </div>
          </PageSection>
        }
      >
        <PageSection className="pb-12 pt-2 sm:pt-4">
          <DiscoveryTabsPanel
            activeTab={tab}
            onTabChange={setTab}
            repositoriesPanel={
              <RepositoryResultsPanel
                hasQuery={hasQuery}
                committedQuery={committedQuery}
                query={queries.repositories}
                onOpenDetail={setDetailSelection}
              />
            }
            moviesPanel={
              <MovieResultsPanel
                hasQuery={hasQuery}
                committedQuery={committedQuery}
                query={queries.movies}
                onOpenDetail={setDetailSelection}
              />
            }
            usersPanel={
              <UserResultsPanel
                hasQuery={hasQuery}
                committedQuery={committedQuery}
                query={queries.users}
                onOpenDetail={setDetailSelection}
              />
            }
          />
        </PageSection>
      </AppShell>

      <DiscoveryDetailDialog
        selection={detailSelection}
        onClose={() => setDetailSelection(null)}
      />
    </div>
  );
}
