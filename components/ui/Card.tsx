"use client";

import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-bg-card p-4",
        variant === "elevated" && "shadow-lg shadow-black/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
