"use client";

import { cn } from "@/lib/cn";
import type { Annotation } from "@/types";

export interface CodeLineProps {
  lineNumber: number;
  html: string;
  annotations: Annotation[];
  isActive: boolean;
  diffType?: "added" | "removed" | "unchanged";
  onClick?: () => void;
}

function getLineHighlight(annotations: Annotation[]): string {
  if (annotations.length === 0) return "";
  const severities = annotations.map((a) => a.severity);
  if (severities.includes("critical")) return "border-l-2 border-l-bug bg-bug/5";
  if (severities.includes("warning")) return "border-l-2 border-l-performance bg-performance/5";
  if (severities.includes("info")) return "border-l-2 border-l-style bg-style/5";
  return "border-l-2 border-l-praise bg-praise/5";
}

export function CodeLine({
  lineNumber,
  html,
  annotations,
  isActive,
  diffType,
  onClick,
}: CodeLineProps) {
  const highlight = getLineHighlight(annotations);

  return (
    <div
      className={cn(
        "flex group text-sm font-mono leading-[1.625rem] transition-colors",
        highlight,
        isActive && "bg-accent/10",
        !isActive && annotations.length === 0 && "hover:bg-bg-hover/50",
        diffType === "added" && "bg-praise/10",
        diffType === "removed" && "bg-bug/10"
      )}
      onClick={onClick}
      data-line-number={lineNumber}
    >
      {/* Line number */}
      <span
        className={cn(
          "w-12 shrink-0 select-none text-right pr-3 text-xs text-text-secondary/50",
          annotations.length > 0 && "text-text-secondary"
        )}
      >
        {lineNumber}
      </span>

      {/* Diff marker */}
      {diffType && (
        <span className={cn(
          "w-4 shrink-0 select-none text-center text-xs",
          diffType === "added" && "text-praise",
          diffType === "removed" && "text-bug"
        )}>
          {diffType === "added" ? "+" : diffType === "removed" ? "-" : " "}
        </span>
      )}

      {/* Code content */}
      <span
        className="flex-1 px-3 overflow-x-auto whitespace-pre"
        dangerouslySetInnerHTML={{ __html: html || "&nbsp;" }}
      />
    </div>
  );
}
