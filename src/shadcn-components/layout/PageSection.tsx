import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  /** Narrow / wide reading width. */
  size?: "default" | "wide";
};

const sizeClass: Record<NonNullable<PageSectionProps["size"]>, string> = {
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

/**
 * Horizontal padding + max width wrapper for main page sections.
 */
export function PageSection({
  children,
  className,
  size = "wide",
}: PageSectionProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6 lg:px-8",
        sizeClass[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
