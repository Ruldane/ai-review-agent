"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Ban } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Verdict } from "@/types";

export interface VerdictBadgeProps {
  verdict: Verdict;
  className?: string;
}

const verdictConfig: Record<Verdict, { label: string; icon: React.ElementType; className: string }> = {
  ship_it: {
    label: "Ship It",
    icon: CheckCircle,
    className: "bg-praise/15 text-praise border-praise/30",
  },
  needs_changes: {
    label: "Needs Changes",
    icon: AlertTriangle,
    className: "bg-performance/15 text-performance border-performance/30",
  },
  request_changes: {
    label: "Request Changes",
    icon: XCircle,
    className: "bg-security/15 text-security border-security/30",
  },
  blocked: {
    label: "Blocked",
    icon: Ban,
    className: "bg-bug/15 text-bug border-bug/30",
  },
};

export function VerdictBadge({ verdict, className }: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.4 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
        config.className,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {config.label}
    </motion.div>
  );
}
