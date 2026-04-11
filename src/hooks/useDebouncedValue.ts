import { useEffect, useState } from "react";

/**
 * Returns `value` after it has stayed stable for `delayMs`.
 * Useful for debouncing URL updates and network requests driven by text input.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = globalThis.setTimeout(() => setDebounced(value), delayMs);
    return () => globalThis.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
