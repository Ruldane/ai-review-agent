"use client";

import { Code2, GitCompareArrows } from "lucide-react";
import { cn } from "@/lib/cn";
import type { InputMode } from "@/types";

export interface ModeToggleProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  detectedMode?: InputMode;
  className?: string;
}

export function ModeToggle({ mode, onModeChange, detectedMode, className }: ModeToggleProps) {
  const modes: { value: InputMode; label: string; icon: React.ElementType }[] = [
    { value: "code", label: "Code", icon: Code2 },
    { value: "diff", label: "Diff", icon: GitCompareArrows },
  ];

  return (
    <div className={cn("flex items-center gap-1 rounded-lg bg-bg-primary p-1", className)}>
      {modes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onModeChange(value)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            mode === value
              ? "bg-bg-card text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
          {detectedMode === value && mode !== value && (
            <span className="text-[10px] text-accent">(detected)</span>
          )}
        </button>
      ))}
    </div>
  );
}
