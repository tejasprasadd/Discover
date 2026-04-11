import { type RefObject, useEffect } from "react";

/**
 * Focus the spotlight field on ⌘K / Ctrl+K (common command-palette pattern, matches Spotlight muscle memory).
 */
export function useSpotlightFocusShortcut(
  targetRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.key || e.key.toLowerCase() !== "k") return;
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.altKey || e.shiftKey) return;

      const el = targetRef.current;
      if (!el) return;

      e.preventDefault();
      el.focus({ preventScroll: false });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, targetRef]);
}
