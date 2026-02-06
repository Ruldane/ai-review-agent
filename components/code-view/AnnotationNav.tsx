"use client";

import { useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AnnotationNavProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export function AnnotationNav({
  currentIndex,
  total,
  onPrev,
  onNext,
  className,
}: AnnotationNavProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        onPrev();
      }
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        onNext();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext]);

  if (total === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full border border-border bg-bg-card px-4 py-2 shadow-lg shadow-black/30",
        className
      )}
    >
      <button
        onClick={onPrev}
        disabled={currentIndex <= 0}
        className="p-1 text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
        aria-label="Previous issue"
      >
        <ChevronUp className="h-4 w-4" />
      </button>

      <span className="text-xs text-text-secondary min-w-[80px] text-center">
        Issue {currentIndex + 1} of {total}
      </span>

      <button
        onClick={onNext}
        disabled={currentIndex >= total - 1}
        className="p-1 text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
        aria-label="Next issue"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}
