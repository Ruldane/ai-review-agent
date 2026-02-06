"use client";

import { useState } from "react";
import { Wrench, Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { generateMarkdown } from "@/lib/markdown-export";
import type { ReviewResult } from "@/types";

export interface SummaryActionsProps {
  review: ReviewResult;
  appliedCount: number;
  totalFixable: number;
  onApplyAll: () => void;
  className?: string;
}

export function SummaryActions({
  review,
  appliedCount,
  totalFixable,
  onApplyAll,
  className,
}: SummaryActionsProps) {
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleCopy = async () => {
    const markdown = generateMarkdown(review);
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setToastVisible(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const markdown = generateMarkdown(review);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code-review.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {totalFixable > 0 && (
        <Button
          variant="primary"
          size="sm"
          onClick={onApplyAll}
          disabled={appliedCount >= totalFixable}
        >
          <Wrench className="h-3.5 w-3.5" />
          Apply All Fixes
          <span className="text-xs opacity-70">
            {appliedCount}/{totalFixable}
          </span>
        </Button>
      )}

      <Button variant="secondary" size="sm" onClick={handleCopy}>
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy Markdown"}
      </Button>

      <Button variant="ghost" size="sm" onClick={handleDownload}>
        <Download className="h-3.5 w-3.5" />
        Download .md
      </Button>

      <Toast
        message="Review copied to clipboard!"
        type="success"
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
        duration={1500}
      />
    </div>
  );
}
