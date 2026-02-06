"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { examples } from "@/data/examples";
import { cn } from "@/lib/cn";

export interface ExampleLoaderProps {
  onLoad: (code: string, language: string, context: string) => void;
  className?: string;
}

export function ExampleLoader({ onLoad, className }: ExampleLoaderProps) {
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
        className="flex items-center gap-2 rounded-md border border-border bg-bg-code px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
      >
        <BookOpen className="h-4 w-4" />
        Load Example
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-md border border-border bg-bg-card shadow-lg shadow-black/30">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => {
                onLoad(example.code, example.language, example.context);
                setOpen(false);
              }}
              className="flex w-full flex-col gap-0.5 px-3 py-2.5 text-left hover:bg-bg-hover transition-colors first:rounded-t-md last:rounded-b-md"
            >
              <span className="text-sm font-medium text-text-primary">{example.title}</span>
              <span className="text-xs text-text-secondary line-clamp-1">{example.context}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
