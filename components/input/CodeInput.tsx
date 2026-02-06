"use client";

import { useRef, useMemo, KeyboardEvent } from "react";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

const MAX_LINES = 500;
const MAX_CHARS = 15000;

export interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CodeInput({ value, onChange, className }: CodeInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = useMemo(() => {
    return value ? value.split("\n").length : 1;
  }, [value]);

  const charCount = value.length;
  const overLimit = lineCount > MAX_LINES || charCount > MAX_CHARS;

  const lineNumbers = useMemo(() => {
    const count = Math.max(lineCount, 1);
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [lineCount]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  return (
    <div className={cn("flex flex-col rounded-lg border border-border bg-bg-code overflow-hidden", className)}>
      <div className="flex flex-1 overflow-auto max-h-[500px]">
        {/* Line numbers gutter */}
        <div
          className="flex flex-col items-end px-3 py-3 select-none text-text-secondary text-xs font-mono leading-[1.625rem] border-r border-border bg-bg-primary/50 shrink-0"
          aria-hidden="true"
        >
          {lineNumbers.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your code or diff here..."
          className="flex-1 bg-transparent p-3 text-sm font-mono text-text-primary resize-none outline-none leading-[1.625rem] placeholder:text-text-secondary min-h-[200px]"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-border text-xs text-text-secondary">
        <div className="flex items-center gap-3">
          <span>{lineCount} lines</span>
          <span>{charCount} chars</span>
          {overLimit && (
            <span className="flex items-center gap-1 text-performance">
              <AlertTriangle className="h-3 w-3" />
              {lineCount > MAX_LINES ? `Max ${MAX_LINES} lines` : `Max ${MAX_CHARS} chars`}
            </span>
          )}
        </div>
        {value && (
          <button
            onClick={() => onChange("")}
            className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Clear code"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
