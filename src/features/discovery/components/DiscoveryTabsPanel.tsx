import { Film, GitBranch, Users } from "lucide-react";
import type { ReactNode } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { DiscoveryTab } from "@/types";
import { cn } from "@/lib/utils";

export type DiscoveryTabsPanelProps = {
  activeTab: DiscoveryTab;
  onTabChange: (tab: DiscoveryTab) => void;
  repositoriesPanel: ReactNode;
  moviesPanel: ReactNode;
  usersPanel: ReactNode;
  className?: string;
};

/**
 * Source tabs shell — only handles tab chrome and layout; content is injected for reuse and testing.
 */
export function DiscoveryTabsPanel({
  activeTab,
  onTabChange,
  repositoriesPanel,
  moviesPanel,
  usersPanel,
  className,
}: DiscoveryTabsPanelProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as DiscoveryTab)}
      className={cn("flex w-full flex-col gap-6", className)}
    >
      <TabsList
        variant="line"
        className="mx-auto flex h-auto w-full max-w-2xl flex-wrap justify-center gap-0 border-b border-border bg-transparent p-0"
      >
        <TabsTrigger
          value="repositories"
          className="min-w-0 flex-1 rounded-none border-0 border-b-2 border-transparent px-3 py-3 data-active:border-primary data-active:bg-transparent sm:flex-none sm:px-6"
        >
          <GitBranch className="size-4" aria-hidden />
          <span className="ml-1.5">Repositories</span>
        </TabsTrigger>
        <TabsTrigger
          value="movies"
          className="min-w-0 flex-1 rounded-none border-0 border-b-2 border-transparent px-3 py-3 data-active:border-primary data-active:bg-transparent sm:flex-none sm:px-6"
        >
          <Film className="size-4" aria-hidden />
          <span className="ml-1.5">Movies</span>
        </TabsTrigger>
        <TabsTrigger
          value="users"
          className="min-w-0 flex-1 rounded-none border-0 border-b-2 border-transparent px-3 py-3 data-active:border-primary data-active:bg-transparent sm:flex-none sm:px-6"
        >
          <Users className="size-4" aria-hidden />
          <span className="ml-1.5">Users</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="repositories" className="mt-0 outline-none">
        {repositoriesPanel}
      </TabsContent>
      <TabsContent value="movies" className="mt-0 outline-none">
        {moviesPanel}
      </TabsContent>
      <TabsContent value="users" className="mt-0 outline-none">
        {usersPanel}
      </TabsContent>
    </Tabs>
  );
}
