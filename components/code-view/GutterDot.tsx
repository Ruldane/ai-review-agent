"use client";

import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import type { Annotation, Severity } from "@/types";

export interface GutterDotProps {
  annotations: Annotation[];
  expanded: boolean;
  onClick: () => void;
  index: number;
}

function getHighestSeverity(annotations: Annotation[]): Severity {
  const order: Severity[] = ["critical", "warning", "info", "praise"];
  for (const severity of order) {
    if (annotations.some((a) => a.severity === severity)) return severity;
  }
  return "info";
}

const severityColor: Record<Severity, string> = {
  critical: "bg-bug",
  warning: "bg-performance",
  info: "bg-style",
  praise: "bg-praise",
};

export function GutterDot({ annotations, expanded, onClick, index }: GutterDotProps) {
  const severity = getHighestSeverity(annotations);
  const count = annotations.length;
  const tooltip =
    count === 1
      ? annotations[0].title
      : `${count} issues on this line`;

  return (
    <Tooltip content={tooltip}>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15, delay: index * 0.08 }}
        onClick={onClick}
        className={cn(
          "relative flex h-5 w-5 items-center justify-center rounded-full transition-transform",
          severityColor[severity],
          expanded && "ring-2 ring-offset-1 ring-offset-bg-code",
          expanded && severity === "critical" && "ring-bug",
          expanded && severity === "warning" && "ring-performance",
          expanded && severity === "info" && "ring-style",
          expanded && severity === "praise" && "ring-praise"
        )}
        aria-label={tooltip}
      >
        {count > 1 && (
          <span className="text-[9px] font-bold text-white">{count}</span>
        )}
      </motion.button>
    </Tooltip>
  );
}
