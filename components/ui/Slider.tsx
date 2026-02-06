"use client";

import { cn } from "@/lib/cn";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  steps: string[];
  className?: string;
}

export function Slider({ value, onChange, steps, className }: SliderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-1">
        {steps.map((label, index) => (
          <button
            key={label}
            onClick={() => onChange(index)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              index === value
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
