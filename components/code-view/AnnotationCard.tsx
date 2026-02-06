"use client";

import { motion } from "framer-motion";
import { Wrench, Copy, X, Check } from "lucide-react";
import { useState } from "react";
import { CategoryBadge, SeverityBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { Annotation } from "@/types";

export interface AnnotationCardProps {
  annotation: Annotation;
  isApplied: boolean;
  onApplyFix: () => void;
  onDismiss: () => void;
  className?: string;
}

export function AnnotationCard({
  annotation,
  isApplied,
  onApplyFix,
  onDismiss,
  className,
}: AnnotationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyFix = async () => {
    if (!annotation.suggestion) return;
    await navigator.clipboard.writeText(annotation.suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "border-l-2 border-border bg-bg-card mx-12 rounded-md overflow-hidden",
        annotation.severity === "critical" && "border-l-bug",
        annotation.severity === "warning" && "border-l-performance",
        annotation.severity === "info" && "border-l-style",
        annotation.severity === "praise" && "border-l-praise",
        className
      )}
    >
      <div className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CategoryBadge category={annotation.category} />
            <SeverityBadge severity={annotation.severity} />
          </div>
          <button
            onClick={onDismiss}
            className="text-text-secondary hover:text-text-primary transition-colors p-1"
            aria-label="Dismiss annotation"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Title & description */}
        <p className="text-sm font-medium text-text-primary">{annotation.title}</p>
        <p className="text-xs text-text-secondary leading-relaxed">{annotation.description}</p>

        {/* Suggestion */}
        {annotation.suggestion && (
          <div className="rounded-md bg-bg-code border border-border overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
              <span className="text-[10px] font-semibold text-text-secondary uppercase">Suggested Fix</span>
              <div className="flex items-center gap-1">
                {!isApplied && (
                  <button
                    onClick={onApplyFix}
                    className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium text-accent hover:bg-accent/10 transition-colors"
                  >
                    <Wrench className="h-3 w-3" />
                    Apply
                  </button>
                )}
                {isApplied && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-praise">
                    <Check className="h-3 w-3" />
                    Applied
                  </span>
                )}
                <button
                  onClick={handleCopyFix}
                  className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            <pre className="p-3 text-xs font-mono text-text-primary overflow-x-auto whitespace-pre">
              {annotation.suggestion}
            </pre>
          </div>
        )}
      </div>
    </motion.div>
  );
}
