import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function DiscoveryLoadMoreButton({
  label,
  isFetching,
  onFetch,
  footer,
}: {
  label: string;
  isFetching: boolean;
  onFetch: () => void;
  footer?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-w-[200px]"
        onClick={onFetch}
        disabled={isFetching}
      >
        {isFetching ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading…
          </>
        ) : (
          label
        )}
      </Button>
      {footer}
    </div>
  );
}
