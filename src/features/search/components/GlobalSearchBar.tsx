import { Search } from "lucide-react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type GlobalSearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSubmitSearch: () => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  isBusy?: boolean;
  className?: string;
};

/**
 * Accessible search field + submit. Does not own URL state — parent passes handlers from `useDiscoverySearchState`.
 */
export function GlobalSearchBar({
  value,
  onValueChange,
  onSubmitSearch,
  id = "global-search",
  placeholder = "Search repositories, movies…",
  disabled = false,
  isBusy = false,
  className,
}: GlobalSearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmitSearch();
  };

  const busy = disabled || isBusy;

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("w-full", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        <label htmlFor={id} className="sr-only">
          Search
        </label>
        <Input
          id={id}
          type="search"
          name="q"
          autoComplete="off"
          enterKeyHint="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={busy}
          className="h-11 flex-1 text-base sm:text-sm"
          aria-busy={isBusy}
        />
        <Button
          type="submit"
          disabled={busy}
          className="h-11 shrink-0 gap-2 sm:min-w-[7.5rem]"
        >
          <Search className="size-4" aria-hidden />
          Search
        </Button>
      </div>
    </form>
  );
}
