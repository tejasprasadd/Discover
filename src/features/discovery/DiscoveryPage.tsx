import { useRef } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { PageSection } from "@/components/layout/PageSection";
import { DiscoveryPlaceholderPanel } from "@/features/discovery/components/DiscoveryPlaceholderPanel";
import { DiscoveryTabsPanel } from "@/features/discovery/components/DiscoveryTabsPanel";
import { SpotlightSearchBar } from "@/features/search/components/SpotlightSearchBar";
import { useDiscoverySearchState } from "@/hooks/useDiscoverySearchState";
import { useSpotlightFocusShortcut } from "@/hooks/useSpotlightFocusShortcut";

export function DiscoveryPage() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  useSpotlightFocusShortcut(searchInputRef);

  const {
    draft,
    setDraft,
    committedQuery,
    tab,
    setTab,
    commitSearchNow,
  } = useDiscoverySearchState();

  const hasQuery = committedQuery.length > 0;

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
        stickyHeader={false}
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
                A single query drives repositories and movies. Your search and tab live in the URL — shareable,
                reloadable, and aligned with the product PRD.
              </p>
              <div className="mt-10 w-full">
                <SpotlightSearchBar
                  ref={searchInputRef}
                  value={draft}
                  onValueChange={setDraft}
                  onSubmitSearch={commitSearchNow}
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
              <DiscoveryPlaceholderPanel
                variant={hasQuery ? "ready" : "idle"}
                committedQuery={committedQuery}
                sourceLabel="Repository"
              />
            }
            moviesPanel={
              <DiscoveryPlaceholderPanel
                variant={hasQuery ? "ready" : "idle"}
                committedQuery={committedQuery}
                sourceLabel="Movie"
              />
            }
          />
        </PageSection>
      </AppShell>
    </div>
  );
}
