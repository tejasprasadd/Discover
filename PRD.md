# Product Requirements Document

## Tabs-Based Search & Discovery Web App

**Project Name:** Discover  
**Tech Direction:** React + Bun + TypeScript + shadcn/ui  
**Document Type:** Product Requirements Document  
**Status:** Draft  
**Audience:** Product, Engineering, Design, QA, and Reviewers

---

## 1. Executive Summary

Build a production-grade Tabs-Based Search & Discovery Web App that lets users search once and inspect results across multiple content sources in a single, unified interface. The experience should feel fast, stable, and consistent while preserving fetched data and user context when switching between tabs.

The product is intended to simulate a real-world multi-source discovery surface. A user enters one query, sees categorized results in distinct tabs, switches between tabs without losing state, and can open detailed views for any item. The application must support basic performance optimizations, clear loading and error handling, URL-based query persistence, responsive layouts, and maintainable code structure.

This PRD is written to guide implementation using React on Bun, with a strong preference for shadcn/ui components and a codebase that prioritizes readability, modularity, and long-term maintainability.

---

## 2. Product Vision

The app should feel like a polished, modern discovery layer that aggregates different content domains behind one search box. Users should be able to compare repositories, movies, and optionally users, without navigating away or re-entering the same search term.

The core product value is efficiency:

- One search input drives multiple sources.
- Tabs keep related results organized.
- Switching tabs should not discard data already fetched.
- Detail views should help users inspect items without breaking flow.
- The UI should make asynchronous data and edge cases easy to understand.

The product should be credible enough to resemble an internal tool or customer-facing prototype, not a demo that only works on the happy path.

---

## 3. Goals

### Primary Goals

1. Provide a single global search experience across multiple data sources.
2. Display results in tabs, each representing a distinct content category.
3. Preserve fetched data and UI state when switching tabs.
4. Support detailed item inspection through modal or dedicated detail page.
5. Keep the interface responsive, consistent, and easy to use on mobile and desktop.
6. Maintain code quality suitable for a production codebase.

### Secondary Goals

1. Persist the search query in the URL for shareable and recoverable state.
2. Avoid redundant network requests through caching and request deduplication.
3. Support debounced input and controlled search submission.
4. Provide a clear pattern for future source expansion.
5. Establish a reusable component architecture with separation of concerns.

---

## 4. Non-Goals

The following are explicitly out of scope unless later added as follow-up work:

1. User authentication and accounts.
2. Saved searches or bookmarks.
3. Personalization or recommendation algorithms.
4. Full-text indexing or backend search aggregation service.
5. Offline mode.
6. Complex permissions or multi-tenant behavior.
7. Real-time updates or websockets.
8. Deep analytics dashboards.

---

## 5. Target Users

### 5.1 Primary User
A reviewer, recruiter, or internal stakeholder evaluating the candidate’s ability to build a real-world search interface.

### 5.2 Secondary User
A developer or product designer exploring a reference implementation for a multi-source discovery UI.

### 5.3 User Needs

1. Search once and compare across categories.
2. Quickly understand result quality and metadata.
3. Switch contexts without losing state.
4. Handle empty or failing requests gracefully.
5. Open details without cluttering the main screen.

---

## 6. Product Principles

1. Single source of truth for query state.
2. Preserve work in progress across tab switches.
3. Fetch only what is needed, when it is needed.
4. Prefer readable abstractions over over-optimized code.
5. Use consistent UI patterns across all result types.
6. Make loading, empty, and error states explicit.
7. Keep the app modular so additional tabs can be added with minimal changes.

---

## 7. Information Architecture

### Core Surface

- Global search bar at the top.
- Tabs row beneath the search bar.
- Result panel that changes by active tab.
- Detail view launched from a result item.

### Proposed Tabs

1. Repositories
2. Movies
3. Users

The app must use at least two APIs. The recommended baseline is GitHub REST API and TMDB API. Random User API may be included as a third optional source.

---

## 8. Functional Requirements

### 8.1 Global Search

**Description:** One search field controls all discovery categories.

**Requirements:**

1. The search input must sit at the top of the page and remain visually prominent.
2. Users can trigger search via Enter key or a search button.
3. Search query should be debounced to prevent unnecessary calls during rapid typing.
4. The query should sync to the URL as `?q=term`.
5. Search should gracefully handle empty input.
6. The query must be reusable across tabs without re-entry.

**Acceptance Criteria:**

- Entering a query and submitting it triggers fetches for the active or configured tabs.
- Refreshing the page with a query in the URL restores the search state.
- Typing rapidly does not cause a request per keystroke.

---

### 8.2 Tabs System

**Description:** Each content source is isolated into a tab with its own state.

**Requirements:**

1. Tabs must clearly indicate the active source.
2. Switching tabs must preserve previously fetched results.
3. Each tab should maintain its own loading, error, empty, and success states.
4. Tabs should not re-fetch data on every switch unless data is stale or invalidated.
5. The tab system should be extensible for future categories.

**Acceptance Criteria:**

- Switching from Repositories to Movies and back restores prior repository results instantly.
- If one tab fails, other tabs can still display valid data.
- Loading states are scoped to the active or requested tab, not global in a blocking way.

---

### 8.3 Results List

**Description:** Each tab renders a list or grid of cards with relevant metadata.

**Requirements:**

1. Results should use a consistent visual pattern across sources.
2. Cards should present the most valuable metadata first.
3. Each card must be clickable and accessible via keyboard.
4. Layout should adapt smoothly to small and large screens.
5. Lists must support pagination or load more behavior for larger result sets.

**Suggested Data Mapping:**

- Repositories: name, owner, stars, forks, language, description.
- Movies: title, poster, rating, release date, overview.
- Users: avatar, name, handle, location, basic profile details.

**Acceptance Criteria:**

- Results are visually scannable.
- Cards do not shift layout unexpectedly while data is loading.
- The list remains readable on mobile.

---

### 8.4 Detail View

**Description:** Selecting an item opens a deeper information view.

**Requirements:**

1. Detail view can be implemented as a modal or a dedicated route.
2. The detail view must show richer metadata than the card.
3. Detail content should be source-aware and visually consistent.
4. The user should be able to close the modal or navigate back cleanly.
5. Detail opening should not reset the current tab state.

**Acceptance Criteria:**

- Clicking a repository, movie, or user opens a detailed presentation.
- Returning from the detail view preserves the list scroll position as much as practical.
- Detail view remains accessible on mobile.

---

### 8.5 Loading, Empty, and Error States

**Description:** The app must handle real-world API behavior gracefully.

**Requirements:**

1. Show skeletons or loaders while data is fetching.
2. Show a clear empty state when no results are found.
3. Show a tab-level error state when a request fails.
4. Provide a retry action for failed tabs.
5. Differentiate between no query, no results, and failed request.

**Acceptance Criteria:**

- A failed movie request does not break repository results.
- Empty search input does not produce misleading errors.
- Retry refires only the failed request or tab.

---

### 8.6 Persistence and State Handling

**Description:** State should survive the common navigation and interaction paths.

**Requirements:**

1. Persist the search query in the URL.
2. Optionally persist the active tab in the URL or local state.
3. Preserve fetched data while switching tabs.
4. Avoid unnecessary re-fetches unless query or tab scope changes.
5. Keep tab state isolated from unrelated UI state.

**Acceptance Criteria:**

- Copying the URL and reopening the page restores the same search.
- Switching tabs does not lose prior loaded results.

---

## 9. API Requirements

### 9.1 Required APIs

The app must integrate with at least two of the following:

1. GitHub REST API
2. TMDB API
3. Random User API

### 9.2 Recommended Baseline Integration

**GitHub REST API**

- Search repositories.
- Display stars, forks, and description.
- Support pagination or load more.

**TMDB API**

- Search movies.
- Display poster, rating, and overview.
- Handle poster fallback when artwork is missing.

**Optional Random User API**

- Search or fetch user records.
- Display profile information with avatar.
- Handle missing or partial profile data cleanly.

### 9.3 API Handling Requirements

1. Use fetch or axios through a dedicated API layer.
2. Abstract endpoint logic into reusable service functions or hooks.
3. Normalize API responses so UI components do not depend on raw provider-specific shape.
4. Manage API keys through environment variables.
5. Respect API rate limits through caching and request deduplication.
6. Handle partial failure independently per tab.

### 9.4 API Key and Environment Strategy

- Store provider keys in environment variables.
- Avoid hardcoding secrets in source files.
- Document any required setup in README or a dedicated env example file.
- Keep client-side exposure intentional and limited to public-safe keys only.

---

## 10. UX Requirements

### 10.1 Layout

1. The page should feel focused and lightweight.
2. The search bar should dominate the top of the interface.
3. Tabs should be easy to identify and switch.
4. Results should occupy the majority of viewport space.
5. Detail view should not overwhelm the primary discovery flow.

### 10.2 Visual Consistency

1. All tabs should use the same base card system.
2. Metadata presentation should follow a shared typographic hierarchy.
3. Loading, empty, and error states should feel like part of the same system.
4. Icons and spacing should be consistent across categories.

### 10.3 Accessibility

1. Inputs, tabs, buttons, and cards must be keyboard accessible.
2. Interactive elements should have visible focus states.
3. Color contrast should meet accessibility standards.
4. Semantic structure should be used for headings, tabs, and lists.
5. Detail modal or page should support screen readers appropriately.

### 10.4 Responsive Behavior

1. Mobile: stacked layout, compact tab navigation, touch-friendly spacing.
2. Tablet: balanced multi-column cards where appropriate.
3. Desktop: denser but readable card grid or list.
4. The search bar and tabs should remain usable on small widths.

---

## 11. Performance Requirements

### 11.1 Performance Goals

1. Avoid duplicate API calls for the same query and tab.
2. Keep UI responsive while data is loading.
3. Minimize re-renders through localized state and memoized derived values where needed.
4. Prefetch likely next data when it improves perceived performance.
5. Keep bundle size reasonable through selective dependency use.

### 11.2 Performance Strategies

1. Use React Query or TanStack Query for caching, deduplication, and background fetching.
2. Use debounced input handling.
3. Fetch only when a query is committed.
4. Preserve tab data in memory while the session is active.
5. Consider pagination or infinite scroll only if needed for a tab.
6. Use skeletons instead of blocking spinners where appropriate.

### 11.3 Performance Acceptance Criteria

- Fast typing does not overwhelm the network.
- Switching tabs feels instant after data is cached.
- The interface remains interactive during loading.
- No tab repeatedly fetches identical results without a valid reason.

---

## 12. Suggested Technical Architecture

This section describes the expected direction for implementation, not an exact mandate.

### 12.1 Core Stack

1. React 19
2. TypeScript
3. Bun runtime and tooling
4. shadcn/ui for base components
5. Radix UI primitives via shadcn
6. Tailwind CSS for styling
7. TanStack Query for server state
8. React Router or URL-driven local state handling
9. Lucide icons for iconography
10. Zod for runtime validation where beneficial

### 12.2 Why These Libraries

1. shadcn/ui gives high-quality, composable primitives without locking into a heavy design system.
2. TanStack Query reduces request boilerplate and handles caching, stale data, retries, and deduplication.
3. Zod adds a lightweight safety layer for normalizing API payloads.
4. Lucide provides a clean and consistent icon set.
5. Tailwind keeps the UI implementation fast while still readable when paired with disciplined component boundaries.

### 12.3 Architecture Principles

1. Separate UI, hooks, services, and data adapters.
2. Keep provider-specific logic out of presentational components.
3. Use typed result models for each source.
4. Centralize query and cache state.
5. Make each tab a self-contained unit built on shared primitives.

---

## 13. Proposed Folder Structure

The exact structure may evolve, but the codebase should remain organized in this general shape:

- `src/components/` for shared UI components
- `src/components/ui/` for shadcn-generated primitives
- `src/features/search/` for search input, query state, and orchestration
- `src/features/tabs/` for tab shell and tab state
- `src/features/repositories/` for GitHub integration and repository UI
- `src/features/movies/` for TMDB integration and movie UI
- `src/features/users/` for optional user integration
- `src/hooks/` for reusable custom hooks
- `src/lib/` for utilities, formatting, query client, and helpers
- `src/services/` for API clients and fetch wrappers
- `src/types/` for shared and provider-specific TypeScript types
- `src/routes/` if route-based detail view is used

### Folder Rules

1. Shared abstractions live in common folders, not inside feature folders.
2. Feature-specific logic stays isolated to preserve readability.
3. Components should not directly fetch data unless they are specifically designed as data containers.
4. Shared helpers should be small and well-named.

---

## 14. Component Inventory

### Shared Components

1. SearchBar
2. TabsNav
3. ResultCardBase
4. LoadingSkeleton
5. EmptyState
6. ErrorState
7. RetryButton
8. DetailModal or DetailDrawer
9. PaginationControls or LoadMoreButton
10. AppShell

### Feature Components

1. RepositoryCard
2. MovieCard
3. UserCard
4. RepositoryDetailPanel
5. MovieDetailPanel
6. UserDetailPanel
7. SourceResultsList

### Utility and Infrastructure Components

1. QueryProvider or AppQueryClient
2. URLStateSync helper
3. API response normalizers
4. Formatters for stars, ratings, dates, and counts

---

## 15. Data Model Expectations

### 15.1 Shared Result Shape

The app should normalize provider data into a shared shape where possible, while still allowing source-specific fields for detail views.

Example conceptual fields:

- `id`
- `source`
- `title` or `name`
- `subtitle`
- `description`
- `thumbnail`
- `metadata`
- `raw`

### 15.2 Source-Specific Fields

**Repositories**

- owner
- stars
- forks
- language
- repo URL

**Movies**

- poster path
- vote average
- release date
- overview
- popularity

**Users**

- avatar URL
- username
- location
- profile link
- follower count if available

### 15.3 Normalization Requirement

The UI should not directly depend on raw GitHub or TMDB response objects. Data should be mapped into typed app models so component logic stays clean and predictable.

---

## 16. State Management Requirements

### 16.1 State Categories

1. Query state
2. Active tab state
3. Per-tab fetch state
4. Detail view state
5. Pagination state
6. URL state

### 16.2 Recommended Approach

1. Keep query and active tab in URL-aware state.
2. Store source results in a cache-backed server-state layer.
3. Keep UI-only state local where possible.
4. Avoid using global state libraries unless the complexity clearly justifies them.

### 16.3 State Boundaries

- Query changes should trigger fetches.
- Tab changes should not invalidate unrelated data.
- Detail view state should not reset the current search results.
- Pagination should be scoped per source and query.

---

## 17. Error Handling Requirements

The app must model realistic failure modes.

### Scenarios

1. Empty input.
2. No results.
3. One API fails while others succeed.
4. Rate limited requests.
5. Slow network.
6. Invalid or missing API key.
7. Malformed response payload.

### Required Behavior

1. Show a clear message when no query is entered.
2. Distinguish no results from an API error.
3. Allow retry from the failed tab.
4. Preserve successfully fetched tabs when another tab fails.
5. Keep the UI usable even when one source is unavailable.

---

## 18. Testing Strategy

### Minimum Testing Scope

1. Unit tests for utility functions and normalizers.
2. Component tests for tab switching and empty/error states.
3. Hook tests for query orchestration and fetch behavior.
4. Optional integration tests for search-to-results flow.

### Important Test Cases

1. Search submission triggers all expected fetches.
2. Switching tabs does not clear cached data.
3. Retry after error refetches correctly.
4. URL query restoration works.
5. Empty and loading states render correctly.
6. Pagination or load more works without duplicating items.

### Testing Philosophy

- Prefer tests around user-visible behavior and data orchestration.
- Avoid overspecifying implementation details.
- Focus on scenarios with real regression risk.

---

## 19. Quality Bar

The codebase should be production-grade in the following ways:

1. Strong TypeScript typing for public interfaces.
2. Clear separation of concerns.
3. Small, composable components.
4. No duplicated provider-specific UI logic.
5. Clean, predictable naming.
6. Consistent formatting and linting.
7. Minimal but purposeful abstraction.
8. Readable code that another engineer can extend confidently.

### Code Hygiene Requirements

1. Avoid deeply nested logic in components.
2. Move data shaping into helpers or adapters.
3. Prefer explicit props over implicit component behavior.
4. Use reusable primitives for layout and state display.
5. Keep side effects confined to hooks or service layers.

---

## 20. Success Metrics

Because this is an assignment-style product, success should be measured by implementation quality and UX clarity rather than business metrics.

### Evaluation Criteria

1. The app works end to end with at least two APIs.
2. The search and tabs model is intuitive.
3. Data persists when switching tabs.
4. The UI is polished and responsive.
5. Error and empty states are well handled.
6. The code structure is clean and easy to inspect.
7. The implementation demonstrates thoughtfulness about performance and real-world edge cases.

---

## 21. Milestone Plan

### Phase 1: Foundation

1. Set up app shell, styling, and component system.
2. Install core dependencies.
3. Build layout, global search bar, and tabs.
4. Establish query state and URL sync.

### Phase 2: Data Integration

1. Implement GitHub search.
2. Implement TMDB search.
3. Optionally add Random User integration.
4. Normalize provider responses.
5. Cache and preserve per-tab data.

### Phase 3: UX Completion

1. Add loading, empty, and error states.
2. Add detail view.
3. Add pagination or load more.
4. Refine responsive behavior.
5. Improve accessibility and keyboard interactions.

### Phase 4: Quality and Polish

1. Add tests.
2. Review code organization.
3. Remove duplication and refine abstractions.
4. Validate production build behavior.
5. Audit for edge cases and regressions.

---

## 22. Risks and Mitigations

### Risk: API Rate Limits

**Mitigation:** Cache results, dedupe requests, and avoid refetching on tab switches.

### Risk: API Key Exposure

**Mitigation:** Use environment variables and only expose public-safe configuration to the client.

### Risk: Inconsistent Provider Shapes

**Mitigation:** Normalize all data through typed adapters before rendering.

### Risk: UI Complexity Grows Too Quickly

**Mitigation:** Keep the shared component system small and extend only when necessary.

### Risk: Re-render Noise or State Entanglement

**Mitigation:** Isolate state by concern and avoid putting everything in one parent component.

---

## 23. Out-of-Scope Implementation Details

This PRD does not mandate exact styling tokens, animation values, or final spacing scales. Those should be defined during implementation using the chosen design system, but the following principles apply:

1. Use modern, clear, and consistent visual language.
2. Favor shadcn/ui primitives for accessibility and maintainability.
3. Avoid overdesigned interfaces that reduce readability.
4. Keep motion subtle and functional.
5. Ensure the app feels polished on first load and during state transitions.

---

## 24. Definition of Done

The project is considered complete when all of the following are true:

1. A single search input drives multi-source results.
2. At least two APIs are integrated successfully.
3. Tabs preserve fetched data across navigation.
4. Detail view works for all supported content types.
5. Loading, empty, and error states are implemented per tab.
6. Query state persists in the URL.
7. The UI is responsive and accessible.
8. The codebase is modular, typed, and readable.
9. The app runs correctly in development and production with Bun.
10. Basic tests or validation exist for core behavior.

---

## 25. Implementation Notes for This Codebase

The current repository is a Bun-based React scaffold, so the implementation should evolve from the existing structure rather than replace it.

Recommended next steps for engineering:

1. Replace the starter app shell with the discovery experience.
2. Introduce a shared query client and API service layer.
3. Add shadcn/ui components for tabs, cards, dialogs, buttons, inputs, skeletons, and alerts.
4. Add custom hooks for debounced search and tab-specific data fetching.
5. Keep `App.tsx` focused on composition only.
6. Move provider logic out of presentational components.
7. Add environment configuration for API keys and public endpoints.

---

## 26. Appendix: Example User Flow

1. User lands on the page and sees the search bar and tabs.
2. User types `react` and submits the query.
3. GitHub repositories, TMDB movies, and optional users fetch in parallel or on demand.
4. Each tab shows its own loading state and later its own results.
5. User switches tabs and sees previously fetched data persist.
6. User clicks a movie card and opens a detail modal with richer information.
7. User returns to the list and continues exploring without losing search context.
8. The URL remains shareable and reloadable.

---

## 27. Final Product Statement

Deliver a clean, resilient, production-minded tabs-based search and discovery application that demonstrates thoughtful architecture, strong UX fundamentals, state persistence, and disciplined use of React, Bun, and shadcn/ui.
