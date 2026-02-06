"use client";

import { motion } from "framer-motion";
import { Bug, Shield, Zap, Paintbrush } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ReviewStats } from "@/types";

export interface StatsBarProps {
  stats: ReviewStats;
  onCategoryClick?: (category: string) => void;
  className?: string;
}

const categoryItems = [
  { key: "bugs" as const, icon: Bug, label: "Bugs", colorClass: "text-bug" },
  { key: "security" as const, icon: Shield, label: "Security", colorClass: "text-security" },
  { key: "performance" as const, icon: Zap, label: "Perf", colorClass: "text-performance" },
  { key: "style" as const, icon: Paintbrush, label: "Style", colorClass: "text-style" },
];

const severityItems = [
  { key: "critical" as const, label: "Critical", colorClass: "bg-bug" },
  { key: "warnings" as const, label: "Warning", colorClass: "bg-performance" },
  { key: "info" as const, label: "Info", colorClass: "bg-style" },
  { key: "praise" as const, label: "Praise", colorClass: "bg-praise" },
];

export function StatsBar({ stats, onCategoryClick, className }: StatsBarProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Category counts */}
      <div className="flex items-center gap-4">
        {categoryItems.map((item, i) => {
          const Icon = item.icon;
          const count = stats[item.key];
          return (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => onCategoryClick?.(item.key)}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80",
                item.colorClass
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="font-semibold">{count}</span>
              <span className="text-text-secondary text-xs hidden sm:inline">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Severity dots */}
      <div className="flex items-center gap-3">
        {severityItems.map((item, i) => {
          const count = stats[item.key];
          if (count === 0) return null;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-1.5 text-xs text-text-secondary"
            >
              <span className={cn("h-2 w-2 rounded-full", item.colorClass)} />
              <span>{count}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
