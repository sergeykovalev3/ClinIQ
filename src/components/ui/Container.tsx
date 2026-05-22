import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[90rem] px-6 md:px-10 lg:px-14",
        className,
      )}
    >
      {children}
    </div>
  );
}
