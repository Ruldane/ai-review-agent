"use client";

import { cn } from "@/lib/cn";
import { getLanguageById } from "@/data/languages";
import type { HistoryEntry as HistoryEntryType } from "@/types";

export interface HistoryEntryProps {
  entry: HistoryEntryType;
  onClick: () => void;
  className?: string;
}

export function HistoryEntry({ entry, onClick, className }: HistoryEntryProps) {
  const lang = getLanguageById(entry.language);
  const preview = entry.code.split("\n")[0]?.slice(0, 30) || "Code snippet";
  const time = new Date(entry.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-bg-hover transition-colors",
        className
      )}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded text-[9px] font-bold bg-bg-hover text-text-secondary shrink-0">
        {lang?.icon || "TX"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-primary truncate">{preview}</p>
        <p className="text-[10px] text-text-secondary">
          Score: {entry.result.score} | {entry.result.annotations.length} issues
        </p>
      </div>
      <span className="text-[10px] text-text-secondary shrink-0">{time}</span>
    </button>
  );
}
