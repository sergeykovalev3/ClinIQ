"use client";

import gsap from "gsap";
import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import {
  resetRoundButtonFill,
  useRoundButtonFill,
} from "@/hooks/useRoundButtonFill";
import {
  resetRoundButtonMagnetic,
  useRoundButtonMagnetic,
} from "@/hooks/useRoundButtonMagnetic";

export type RoundMagneticButtonSize = "md" | "lg";

export const roundMagneticButtonSizes: Record<RoundMagneticButtonSize, string> = {
  md: "h-16 w-16",
  lg: "h-24 w-24",
};

const sizeClasses = roundMagneticButtonSizes;

export type RoundMagneticButtonProps = {
  children: ReactNode;
  size?: RoundMagneticButtonSize;
  enabled?: boolean;
  contentClassName?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function RoundMagneticButton({
  children,
  size = "lg",
  enabled = true,
  className,
  contentClassName,
  type = "button",
  tabIndex,
  "aria-hidden": ariaHidden,
  ...props
}: RoundMagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const enabledRef = useRef(enabled);

  enabledRef.current = enabled;

  useRoundButtonFill({ buttonRef, fillRef });
  useRoundButtonMagnetic({
    buttonRef,
    contentRef,
    enabledRef,
  });

  useEffect(() => {
    if (enabled) return;

    const button = buttonRef.current;
    const content = contentRef.current;
    const fill = fillRef.current;

    if (fill) resetRoundButtonFill(fill);
    if (button && content) resetRoundButtonMagnetic(button, content);
  }, [enabled]);

  return (
    <button
      ref={buttonRef}
      type={type}
      aria-hidden={ariaHidden ?? !enabled}
      tabIndex={tabIndex ?? (enabled ? 0 : -1)}
      className={cn(
        "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-fg shadow-[0_16px_48px_-12px_rgba(15,28,40,0.18)]",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <span
        ref={fillRef}
        className="absolute inset-0 block rounded-full bg-accent"
        aria-hidden
      />
      <span
        ref={contentRef}
        className={cn(
          "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
          contentClassName,
        )}
        aria-hidden
      >
        {children}
      </span>
    </button>
  );
}
