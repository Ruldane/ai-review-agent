"use client";

import { useEffect, useCallback } from "react";
import { Play, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Slider } from "@/components/ui/Slider";
import { cn } from "@/lib/cn";
import type { Category, Strictness } from "@/types";

export interface ReviewConfigProps {
  focus: Category[];
  onFocusChange: (focus: Category[]) => void;
  context: string;
  onContextChange: (context: string) => void;
  strictness: Strictness;
  onStrictnessChange: (strictness: Strictness) => void;
  onSubmit: () => void;
  loading: boolean;
  codeLength: number;
  className?: string;
}

const categories: { id: Category; label: string; color: string }[] = [
  { id: "bug", label: "Bugs", color: "bg-bug" },
  { id: "security", label: "Security", color: "bg-security" },
  { id: "performance", label: "Performance", color: "bg-performance" },
  { id: "style", label: "Style", color: "bg-style" },
];

const strictnessLevels: Strictness[] = ["lenient", "medium", "strict"];
const strictnessLabels = ["Lenient", "Medium", "Strict"];

export function ReviewConfig({
  focus,
  onFocusChange,
  context,
  onContextChange,
  strictness,
  onStrictnessChange,
  onSubmit,
  loading,
  codeLength,
  className,
}: ReviewConfigProps) {
  const canSubmit = codeLength >= 10 && !loading;

  const handleToggle = useCallback(
    (category: Category, checked: boolean) => {
      if (checked) {
        onFocusChange([...focus, category]);
      } else {
        // Don't allow unchecking last one
        const next = focus.filter((c) => c !== category);
        if (next.length > 0) onFocusChange(next);
      }
    },
    [focus, onFocusChange]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) {
        e.preventDefault();
        onSubmit();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canSubmit, onSubmit]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Focus toggles */}
      <div>
        <label className="text-xs font-medium text-text-secondary mb-2 block">Review Focus</label>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Checkbox
              key={cat.id}
              checked={focus.includes(cat.id)}
              onChange={(checked) => handleToggle(cat.id, checked)}
              label={cat.label}
              color={cat.color}
            />
          ))}
        </div>
      </div>

      {/* Context */}
      <div>
        <label className="text-xs font-medium text-text-secondary mb-2 block">
          Context <span className="text-text-secondary/50">({context.length}/200)</span>
        </label>
        <input
          type="text"
          value={context}
          onChange={(e) => onContextChange(e.target.value.slice(0, 200))}
          placeholder="e.g., 'REST API handler for user auth'"
          className="w-full rounded-md border border-border bg-bg-code px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-accent transition-colors"
        />
      </div>

      {/* Strictness */}
      <div>
        <label className="text-xs font-medium text-text-secondary mb-2 block">Strictness</label>
        <Slider
          value={strictnessLevels.indexOf(strictness)}
          onChange={(i) => onStrictnessChange(strictnessLevels[i])}
          steps={strictnessLabels}
        />
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
          canSubmit
            ? "bg-accent text-white hover:bg-accent/90 active:scale-[0.98]"
            : "bg-accent/30 text-white/50 cursor-not-allowed"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Reviewing...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Review Code
            <kbd className="hidden sm:inline-flex ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono">
              {typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent) ? "⌘" : "Ctrl"}+↵
            </kbd>
          </>
        )}
      </button>
    </div>
  );
}
