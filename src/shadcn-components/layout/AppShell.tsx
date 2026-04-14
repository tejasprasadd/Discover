import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppShellProps = {
  /** Sticky top region (search, nav). */
  header: ReactNode;
  /** Primary scrollable content. */
  children: ReactNode;
  className?: string;
  /** When false, header is in-flow (hero / Spotlight) — no sticky bar or bottom border. */
  stickyHeader?: boolean;
  headerClassName?: string;
};

/**
 * Application chrome: header + flexible main. Keeps discovery layouts consistent.
 */
export function AppShell({
  header,
  children,
  className,
  stickyHeader = true,
  headerClassName,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-background text-foreground",
        className,
      )}
    >
      <header
        className={cn(
          stickyHeader &&
            "sticky top-0 z-40 border-b border-border/80 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80",
          !stickyHeader && "relative z-10",
          headerClassName,
        )}
      >
        {header}
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
