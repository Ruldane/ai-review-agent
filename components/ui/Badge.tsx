"use client";

import { Bug, Shield, Zap, Paintbrush, AlertTriangle, Info, ThumbsUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export type Category = "bug" | "security" | "performance" | "style";
export type Severity = "critical" | "warning" | "info" | "praise";

export interface BadgeProps {
  className?: string;
}

export interface CategoryBadgeProps extends BadgeProps {
  category: Category;
}

export interface SeverityBadgeProps extends BadgeProps {
  severity: Severity;
}

const categoryConfig: Record<Category, { label: string; icon: React.ElementType; className: string }> = {
  bug: { label: "BUG", icon: Bug, className: "bg-bug/15 text-bug border-bug/30" },
  security: { label: "SEC", icon: Shield, className: "bg-security/15 text-security border-security/30" },
  performance: { label: "PERF", icon: Zap, className: "bg-performance/15 text-performance border-performance/30" },
  style: { label: "STYLE", icon: Paintbrush, className: "bg-style/15 text-style border-style/30" },
};

const severityConfig: Record<Severity, { label: string; icon: React.ElementType; className: string }> = {
  critical: { label: "CRITICAL", icon: AlertCircle, className: "bg-bug/15 text-bug border-bug/30" },
  warning: { label: "WARNING", icon: AlertTriangle, className: "bg-performance/15 text-performance border-performance/30" },
  info: { label: "INFO", icon: Info, className: "bg-style/15 text-style border-style/30" },
  praise: { label: "PRAISE", icon: ThumbsUp, className: "bg-praise/15 text-praise border-praise/30" },
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
