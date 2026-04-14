import { Search } from "lucide-react";
import { forwardRef, type FormEvent, type Ref } from "react";

import { cn } from "@/lib/utils";

function modKeyForPlatform() {
  return (
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPod|iPad/.test(navigator.platform)
  );
}

export type SpotlightSearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSubmitSearch: () => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  isBusy?: boolean;
  className?: string;
};

const kbdBase =
  "pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-border/80 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex";

/**
 * macOS Spotlight–inspired search: floating glass field, icon-led, Enter to search.
 */
export const SpotlightSearchBar = forwardRef(function SpotlightSearchBar(
  {
    value,
    onValueChange,
    onSubmitSearch,
    id = "spotlight-search",
    placeholder = "Search repos, movies, or names…",
    disabled = false,
    isBusy = false,
    className,
  }: SpotlightSearchBarProps,
  ref: Ref<HTMLInputElement>,
) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmitSearch();
  };

  const busy = disabled || isBusy;
  const modKey = modKeyForPlatform() ? "⌘" : "Ctrl";

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("mx-auto w-full max-w-2xl", className)}
      aria-describedby={`${id}-hint`}
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-border/70 bg-popover/85 px-4 py-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-[box-shadow,transform] duration-200",
          "focus-within:border-ring/60 focus-within:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.18),0_0_0_1px_hsl(var(--ring)/0.25)]",
          "dark:border-border/50 dark:bg-popover/55 dark:shadow-[0_28px_64px_-24px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.06)]",
          busy && "opacity-70",
        )}
      >
        <Search
          className="size-5 shrink-0 text-muted-foreground"
          strokeWidth={2}
          aria-hidden
        />
        <label htmlFor={id} className="sr-only">
          Search discovery
        </label>
        <input
          ref={ref}
          id={id}
          type="search"
          name="q"
          autoComplete="off"
          enterKeyHint="search"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={busy}
          aria-busy={isBusy}
          className={cn(
            "h-12 min-w-0 flex-1 border-0 bg-transparent py-2 text-lg text-foreground outline-none ring-0 placeholder:text-muted-foreground/80",
            "focus-visible:ring-0 md:text-base",
          )}
        />
        <div className="flex shrink-0 items-center gap-2">
          <span className={kbdBase} aria-hidden title="Focus search">
            <span className="text-xs">{modKey}</span> K
          </span>
        </div>
      </div>
      <p id={`${id}-hint`} className="mt-2 text-center text-xs text-muted-foreground">
        Press{" "}
        <kbd className="rounded border border-border/80 bg-muted/40 px-1 font-mono text-[10px]">
          Enter
        </kbd>{" "}
        to search. Query syncs to the URL when you hit Enter.
      </p>
    </form>
  );
});

SpotlightSearchBar.displayName = "SpotlightSearchBar";
