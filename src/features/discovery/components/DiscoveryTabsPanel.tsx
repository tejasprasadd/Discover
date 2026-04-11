import { Film, GitBranch } from "lucide-react";
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
        className="mx-auto flex h-auto w-full max-w-md justify-center gap-0 border-b border-border bg-transparent p-0 sm:max-w-lg"
      >
        <TabsTrigger
          value="repositories"
          className="flex-1 rounded-none border-0 border-b-2 border-transparent px-4 py-3 data-active:border-primary data-active:bg-transparent sm:flex-none sm:px-8"
        >
          <GitBranch className="size-4" aria-hidden />
          <span className="ml-1.5">Repositories</span>
        </TabsTrigger>
        <TabsTrigger
          value="movies"
          className="flex-1 rounded-none border-0 border-b-2 border-transparent px-4 py-3 data-active:border-primary data-active:bg-transparent sm:flex-none sm:px-8"
        >
          <Film className="size-4" aria-hidden />
          <span className="ml-1.5">Movies</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="repositories" className="mt-0 outline-none">
        {repositoriesPanel}
      </TabsContent>
      <TabsContent value="movies" className="mt-0 outline-none">
        {moviesPanel}
      </TabsContent>
    </Tabs>
  );
}
