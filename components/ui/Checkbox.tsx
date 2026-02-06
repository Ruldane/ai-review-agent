"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  color?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, color = "bg-accent", className }: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 cursor-pointer select-none",
        className
      )}
    >
      <button
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded border transition-colors",
          checked
            ? `${color} border-transparent`
            : "border-border bg-bg-code hover:border-text-secondary"
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </button>
      <span className="text-sm text-text-primary">{label}</span>
    </label>
  );
}
