"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import type { Story } from "@/lib/stories";
import { cn } from "@/lib/cn";
import {
  typeAccentCaption,
  typeCardEyebrow,
  typeCardTitle,
  typeCardTitleSpacing,
  typeSectionLead,
  typeSectionLeadSpacing,
} from "@/lib/typography";
import { useStoryCardScrollReveal } from "@/hooks/useStoryCardScrollReveal";
import { StoryCardVisual } from "@/sections/stories/StoryCardVisual";

type StoryCardProps = {
  story: Story;
  reversed?: boolean;
};

const MAGNETIC_X = 30;
const MAGNETIC_Y = 22;

export function StoryCard({ story, reversed = false }: StoryCardProps) {
  const articleRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);

  useStoryCardScrollReveal(articleRef, { reversed });

  useLayoutEffect(() => {
    const node = visualRef.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.set(node, { x: 0, y: 0, force3D: true });

    const bindQuickTo = () => {
      xToRef.current = gsap.quickTo(node, "x", {
        duration: 0.52,
        ease: "power2.out",
      });
      yToRef.current = gsap.quickTo(node, "y", {
        duration: 0.52,
        ease: "power2.out",
      });
    };

    const applyOffset = (event: globalThis.MouseEvent) => {
      if (!xToRef.current || !yToRef.current) return;

      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      xToRef.current(Math.round(x * MAGNETIC_X * 2) / 2);
      yToRef.current(Math.round(y * MAGNETIC_Y * 2) / 2);
    };

    const onEnter = (event: globalThis.MouseEvent) => {
      gsap.killTweensOf(node, "x,y");
      gsap.set(node, { x: 0, y: 0 });
      bindQuickTo();
      applyOffset(event);
    };

    const onMove = (event: globalThis.MouseEvent) => {
      applyOffset(event);
    };

    const onLeave = () => {
      xToRef.current = null;
      yToRef.current = null;
      gsap.killTweensOf(node, "x,y");
      gsap.to(node, {
        x: 0,
        y: 0,
        duration: 0.85,
        ease: "power2.out",
        overwrite: true,
      });
    };

    node.addEventListener("mouseenter", onEnter);
    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);

    return () => {
      node.removeEventListener("mouseenter", onEnter);
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(node);
      gsap.set(node, { clearProps: "transform" });
    };
  }, []);

  return (
    <article ref={articleRef} className="relative py-12 md:py-16 lg:py-20">
      <div
        data-story-rule
        className="absolute inset-x-0 top-0 h-px origin-left bg-border/70"
        aria-hidden
      />
      <div
        className={cn(
          "grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20",
          reversed && "lg:[direction:rtl] lg:[&>*]:![direction:ltr]",
        )}
      >
        <div className="flex flex-col justify-center">
          <p data-story-copy className={typeCardEyebrow}>
            {story.marker}
          </p>
          <h3
            data-story-copy
            className={cn(typeCardTitle, typeCardTitleSpacing, "max-w-[14ch]")}
          >
            {story.title}
          </h3>
          <p
            data-story-copy
            className={cn(typeSectionLead, typeSectionLeadSpacing, "max-w-[22rem]")}
          >
            {story.line}
          </p>
          <p data-story-copy className={cn(typeAccentCaption, "mt-5 md:mt-6")}>
            {story.outcome}
          </p>
        </div>

        <div
          data-story-visual
          className="w-full lg:max-w-[34rem] lg:justify-self-end"
        >
          <div data-story-visual-shift ref={visualRef}>
            <StoryCardVisual variant={story.visual} />
          </div>
        </div>
      </div>
    </article>
  );
}
