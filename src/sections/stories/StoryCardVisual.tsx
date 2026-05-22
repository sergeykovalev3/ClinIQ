"use client";

import type { StoryVisual } from "@/lib/stories";
import { cn } from "@/lib/cn";

type StoryCardVisualProps = {
  variant: StoryVisual;
  className?: string;
};

const mockBg =
  "relative w-full bg-[linear-gradient(155deg,#f6f8fb_0%,#eef2f6_52%,#e8eef4_100%)] md:h-full md:overflow-hidden";

const mockSurface = "rounded-[1.2rem] border border-border/70 bg-surface";

const mockGlow =
  "pointer-events-none absolute left-1/2 top-[42%] hidden h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(29,158,140,0.14)_0%,transparent_72%)] md:block";

const visitQuestions = [
  "Is my cholesterol in a range you expect?",
  "Should we recheck anything before summer?",
  "Do any of these results connect?",
] as const;

function LabsRings() {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 h-[min(72%,14rem)] w-[min(72%,14rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/[0.08]" />
      <div className="absolute left-1/2 top-1/2 h-[min(54%,10rem)] w-[min(54%,10rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/40" />
      <div className="absolute left-1/2 top-[38%] h-[min(44%,8rem)] w-[min(44%,8rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(29,158,140,0.12)_0%,transparent_72%)]" />
    </>
  );
}

function LabsVisual() {
  return (
    <div
      className={cn(
        mockBg,
        "flex items-center justify-center p-3 sm:p-4 md:block md:p-0",
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <LabsRings />
      </div>

      <div
        className={cn(
          mockSurface,
          "relative z-10 flex w-full min-w-0 flex-col gap-3 p-3.5 sm:gap-4 sm:p-4 md:absolute md:inset-x-[13%] md:top-1/2 md:w-auto md:-translate-y-1/2 md:gap-5 md:p-6",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full border border-border/70 bg-bg/90 px-2.5 py-1.5 sm:gap-2 sm:px-3">
            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent sm:h-4 sm:w-4">
              <svg viewBox="0 0 16 16" fill="none" className="h-2 w-2 stroke-current stroke-[1.6] sm:h-2.5 sm:w-2.5">
                <path d="M3 8.5l3 3 7-7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="truncate text-[9px] font-medium text-fg/80 sm:text-[10px]">
              annual-labs.pdf
            </span>
          </div>
          <span className="shrink-0 text-[9px] font-medium tracking-[0.02em] text-muted">
            Read
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-medium tracking-[0.02em] text-muted sm:text-[10px]">
            Questions for your visit
          </p>
          <ul className="mt-2 space-y-2 sm:mt-3 sm:space-y-2.5">
            {visitQuestions.map((question, index) => (
              <li
                key={question}
                className="flex min-w-0 items-start gap-2 rounded-[0.85rem] border border-border/60 bg-bg/70 px-2.5 py-2 sm:gap-3 sm:rounded-[0.9rem] sm:px-3 sm:py-2.5"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/12 font-display text-[9px] font-medium text-accent sm:h-5 sm:w-5 sm:text-[10px]">
                  {index + 1}
                </span>
                <p className="min-w-0 text-[10px] leading-[1.35] text-fg/85 sm:text-[11px] sm:leading-[1.4] md:text-[12px]">
                  {question}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border/50 pt-2.5 sm:pt-3">
          <p className="relative pl-2.5 text-[9px] font-medium tracking-[0.02em] text-accent sm:pl-3 sm:text-[10px]">
            <span
              className="absolute left-0 top-1/2 block h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent"
              aria-hidden
            />
            Prepared for visit
          </p>
        </div>
      </div>
    </div>
  );
}

function CaregiverVisual() {
  return (
    <div
      className={cn(
        mockBg,
        "flex flex-col gap-2.5 p-3 sm:gap-3 sm:p-4 md:block md:p-0",
      )}
    >
      <div className={mockGlow} />

      <div
        className={cn(
          mockSurface,
          "relative z-10 w-full min-w-0 border-border/55 bg-surface/90 p-3 sm:p-4",
          "md:absolute md:left-[10%] md:top-[14%] md:w-[56%] md:rotate-[-8deg]",
        )}
      >
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
        </div>
        <p className="mt-2.5 text-[9px] font-medium tracking-[0.02em] text-muted/80 sm:mt-3 sm:text-[10px]">
          Lab report
        </p>
        <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
          <div className="h-1.5 w-full rounded-full bg-fg/[0.07]" />
          <div className="h-1.5 w-[88%] rounded-full bg-fg/[0.05]" />
          <div className="h-1.5 w-full rounded-full bg-fg/[0.05]" />
          <div className="h-1.5 w-[72%] rounded-full bg-fg/[0.04]" />
        </div>
        <div className="mt-3 space-y-1.5 border-t border-border/50 pt-2.5 sm:mt-4 sm:pt-3">
          <div className="flex justify-between gap-2">
            <div className="h-1.5 w-1/3 rounded-full bg-fg/[0.06]" />
            <div className="h-1.5 w-1/4 rounded-full bg-fg/[0.04]" />
          </div>
          <div className="flex justify-between gap-2">
            <div className="h-1.5 w-2/5 rounded-full bg-fg/[0.05]" />
            <div className="h-1.5 w-1/5 rounded-full bg-fg/[0.04]" />
          </div>
        </div>
      </div>

      <div
        className={cn(
          mockSurface,
          "relative z-20 w-full min-w-0 border-accent/20 p-3 sm:p-4 md:p-5",
          "md:absolute md:bottom-[14%] md:right-[9%] md:w-[64%]",
        )}
      >
        <div className="min-w-0">
          <p className="relative pl-3.5 text-[9px] font-medium tracking-[0.02em] text-accent sm:pl-4 sm:text-[10px]">
            <span
              className="absolute left-0 top-1/2 block h-2 w-2 -translate-y-1/2 rounded-full bg-accent"
              aria-hidden
            />
            Plain summary
          </p>
          <p className="mt-1.5 text-[11px] leading-[1.4] text-fg/88 sm:mt-2 sm:text-[12px] sm:leading-[1.45] md:text-[13px]">
            Kidney numbers look steady. Ask about the new medication dose at the visit.
          </p>
        </div>
      </div>
    </div>
  );
}

const trendBars = [
  { height: 34, muted: true },
  { height: 44, muted: true },
  { height: 38, muted: true },
  { height: 50, muted: true },
  { height: 42, muted: true },
  { height: 56, muted: false },
] as const;

function TrendVisual() {
  return (
    <div
      className={cn(
        mockBg,
        "flex items-center justify-center p-3 sm:p-4 md:p-[13%]",
      )}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(58%,11rem)] w-[min(58%,11rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(29,158,140,0.14)_0%,transparent_72%)]"
        aria-hidden
      />

      <div className={cn(mockSurface, "relative z-10 w-full min-w-0 p-3.5 sm:p-4 md:p-6")}>
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className="text-[9px] font-medium tracking-[0.02em] text-muted sm:text-[10px]">
            A1c trend
          </p>
          <span className="shrink-0 rounded-full border border-border/70 bg-bg/80 px-2 py-0.5 text-[9px] font-medium tracking-[0.02em] text-muted sm:px-2.5 sm:py-1 sm:text-[10px]">
            6 months
          </span>
        </div>

        <div className="relative mt-3 h-[5.25rem] sm:mt-4 sm:h-[6.25rem] md:mt-5 md:h-[7.5rem]">
          <div className="absolute inset-x-0 top-1/4 h-px bg-border/50" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-border/40" />
          <div className="absolute inset-x-0 top-3/4 h-px bg-border/30" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 sm:gap-1.5">
            {trendBars.map((bar, index) => (
              <div
                key={index}
                className={cn(
                  "w-full rounded-t-[3px] sm:rounded-t-[4px]",
                  bar.muted
                    ? "bg-fg/[0.06]"
                    : "bg-gradient-to-t from-accent/25 to-accent/70",
                )}
                style={{ height: `${bar.height}%` }}
              />
            ))}
          </div>

          <svg
            viewBox="0 0 200 72"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[88%] w-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="story-trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(29,158,140,0.18)" />
                <stop offset="100%" stopColor="rgba(29,158,140,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0 52 C28 48, 48 40, 72 36 S120 26, 160 20 S188 16, 200 12 L200 72 L0 72 Z"
              fill="url(#story-trend-fill)"
            />
            <path
              d="M0 52 C28 48, 48 40, 72 36 S120 26, 160 20 S188 16, 200 12"
              fill="none"
              stroke="#1d9e8c"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="200" cy="12" r="3.5" fill="#1d9e8c" />
          </svg>
        </div>

        <p className="mt-3 text-[9px] font-medium tracking-[0.02em] text-muted/90 sm:mt-4 sm:text-[10px]">
          Trend only · not a diagnosis
        </p>
      </div>
    </div>
  );
}

function StoryVisual({ variant }: { variant: StoryVisual }) {
  if (variant === "labs") return <LabsVisual />;
  if (variant === "caregiver") return <CaregiverVisual />;
  return <TrendVisual />;
}

export function StoryCardVisual({ variant, className }: StoryCardVisualProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[1.35rem] border border-border/70 bg-bg",
        "h-auto md:aspect-[4/3]",
        className,
      )}
    >
      <StoryVisual variant={variant} />
    </div>
  );
}
