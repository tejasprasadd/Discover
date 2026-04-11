import { Inbox, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DiscoveryPlaceholderPanelProps = {
  variant: "idle" | "ready";
  /** Shown when user has committed a search — echoes context per tab. */
  committedQuery: string;
  /** Tab-specific label for the “ready” state. */
  sourceLabel: string;
  className?: string;
};

/**
 * Phase-1 placeholder for tab bodies — swaps idle vs “query locked in” messaging without coupling to data fetching yet.
 */
export function DiscoveryPlaceholderPanel({
  variant,
  committedQuery,
  sourceLabel,
  className,
}: DiscoveryPlaceholderPanelProps) {
  const idle = variant === "idle";

  return (
    <Card
      className={cn(
        "border-dashed bg-muted/30 shadow-none",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {idle ? (
            <Inbox className="size-5 text-muted-foreground" aria-hidden />
          ) : (
            <Sparkles className="size-5 text-primary" aria-hidden />
          )}
          <CardTitle className="text-lg">
            {idle ? "Start a search" : `${sourceLabel} results`}
          </CardTitle>
        </div>
        <CardDescription className="text-pretty">
          {idle
            ? "Enter a term above and press Search (or pause typing — your query syncs to the URL after a short delay)."
            : `Query “${committedQuery}” is saved in the URL. Hook up ${sourceLabel.toLowerCase()} fetching here — tab state is preserved when you switch away.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {idle ? (
          <p>
            The address bar uses <code className="rounded bg-muted px-1.5 py-0.5 text-xs">?q=</code>{" "}
            and optional{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">?tab=</code> so you can share
            or reload this page.
          </p>
        ) : (
          <p>
            Active tab and query are driven by the URL — switching tabs does not clear your search
            string.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
