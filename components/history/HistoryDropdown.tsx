"use client";

import { useState, useRef, useEffect } from "react";
import { History, Trash2 } from "lucide-react";
import { HistoryEntry } from "./HistoryEntry";
import { cn } from "@/lib/cn";
import type { HistoryEntry as HistoryEntryType } from "@/types";

export interface HistoryDropdownProps {
  entries: HistoryEntryType[];
  onSelect: (entry: HistoryEntryType) => void;
  onClear: () => void;
  className?: string;
}

export function HistoryDropdown({
  entries,
  onSelect,
  onClear,
  className,
}: HistoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors",
          entries.length > 0 && "text-text-primary"
        )}
        aria-label="Review history"
      >
        <History className="h-4 w-4" />
        {entries.length > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
            {entries.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-md border border-border bg-bg-card shadow-lg shadow-black/30">
          {entries.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-text-secondary">
              No reviews yet
            </div>
          ) : (
            <>
              <div className="max-h-60 overflow-auto">
                {entries.map((entry) => (
                  <HistoryEntry
                    key={entry.id}
                    entry={entry}
                    onClick={() => {
                      onSelect(entry);
                      setOpen(false);
                    }}
                  />
                ))}
              </div>
              <div className="border-t border-border p-2">
                <button
                  onClick={() => {
                    onClear();
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded px-3 py-1.5 text-xs text-text-secondary hover:text-bug hover:bg-bug/10 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear History
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
