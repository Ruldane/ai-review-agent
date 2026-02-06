"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { CategoryBadge, SeverityBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { Annotation } from "@/types";

export interface TopPriorityProps {
  annotation: Annotation;
  onClick?: () => void;
  className?: string;
}

export function TopPriority({ annotation, onClick, className }: TopPriorityProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg border-l-2 border-accent bg-accent/5 p-3 text-left transition-colors hover:bg-accent/10",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs text-accent">
        <AlertCircle className="h-3.5 w-3.5" />
        <span className="font-semibold">Top Priority</span>
      </div>
      <div className="flex items-center gap-2">
        <CategoryBadge category={annotation.category} />
        <SeverityBadge severity={annotation.severity} />
      </div>
      <p className="text-sm font-medium text-text-primary">{annotation.title}</p>
      <p className="text-xs text-text-secondary line-clamp-2">{annotation.description}</p>
    </motion.button>
  );
}
