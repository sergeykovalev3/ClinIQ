"use client";

import { cn } from "@/lib/cn";

const lines = ["Located", "in", "USA"] as const;

type HeroLocationBadgeProps = {
  className?: string;
};

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7 stroke-current stroke-[1.35] md:h-8 md:w-8"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.8 3.1 4.5 6.6 4.5 9s-1.7 5.9-4.5 9c-2.8-3.1-4.5-6.6-4.5-9S9.2 6.1 12 3z" />
    </svg>
  );
}

export function HeroLocationBadge({ className }: HeroLocationBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex max-w-[calc(100vw-1.5rem)] items-center rounded-r-full border-y border-r border-border/70 bg-surface/90 p-1.5 shadow-[0_12px_40px_-24px_rgba(15,28,40,0.35)] backdrop-blur-sm sm:max-w-none sm:p-2",
        className,
      )}
    >
      <div className="px-4 py-2.5 pr-3 font-display text-xs font-medium leading-[1.35] text-fg sm:px-5 sm:py-3 sm:pr-4 sm:text-sm md:px-6 md:py-3.5 md:pr-5 md:text-base">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </div>
      <div className="flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center rounded-full bg-fg text-bg sm:h-[5rem] sm:w-[5rem] md:h-[5.5rem] md:w-[5.5rem]">
        <span className="animate-[spin_10s_linear_infinite]">
          <GlobeIcon />
        </span>
      </div>
    </div>
  );
}
