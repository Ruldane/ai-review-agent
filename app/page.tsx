"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Github, Loader2 } from "lucide-react";
import { CodeInput } from "@/components/input/CodeInput";
import { ModeToggle } from "@/components/input/ModeToggle";
import { LanguageSelector } from "@/components/input/LanguageSelector";
import { ExampleLoader } from "@/components/input/ExampleLoader";
import { ReviewConfig } from "@/components/input/ReviewConfig";
import { SummaryDashboard } from "@/components/summary/SummaryDashboard";
import { SummaryActions } from "@/components/summary/SummaryActions";
import { AnnotatedCodeView } from "@/components/code-view/AnnotatedCodeView";
import { HistoryDropdown } from "@/components/history/HistoryDropdown";
import { Card } from "@/components/ui/Card";
import { useReview } from "@/lib/hooks/useReview";
import { useAnnotations } from "@/lib/hooks/useAnnotations";
import { useFixer } from "@/lib/hooks/useFixer";
import { detectMode } from "@/lib/detect-mode";
import { generateId } from "@/lib/uuid";
import type { HistoryEntry, HighlightedLine, Annotation } from "@/types";

export default function Home() {
  const review = useReview();
  const annotations = useAnnotations();
  const fixer = useFixer();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<HighlightedLine[]>([]);
  const [isHighlighting, setIsHighlighting] = useState(false);

  const detectedMode = useMemo(() => detectMode(review.code), [review.code]);

  // When review completes, update annotations and fixer, add to history
  useEffect(() => {
    if (review.review) {
      annotations.setAnnotations(review.review.annotations);
      fixer.initCode(review.code);

      // Add to history
      const entry: HistoryEntry = {
        id: generateId(),
        code: review.code,
        language: review.language,
        result: review.review,
        timestamp: Date.now(),
      };
      setHistory((prev) => [entry, ...prev].slice(0, 10));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [review.review]);

  // Highlight code when review completes
  useEffect(() => {
    if (!review.review || !review.code) return;

    setIsHighlighting(true);
    // Use simple line-based rendering (Shiki is loaded on-demand)
    const lines = (fixer.currentCode || review.code).split("\n");
    const result: HighlightedLine[] = lines.map((line, i) => ({
      number: i + 1,
      html: escapeHtml(line) || "&nbsp;",
    }));
    setHighlightedLines(result);
    setIsHighlighting(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [review.review, fixer.currentCode]);

  const handleLoadExample = useCallback(
    (code: string, language: string, context: string) => {
      review.setCode(code);
      review.setLanguage(language);
      review.setContext(context);
      review.setMode(detectMode(code));
    },
    [review]
  );

  const handleHistorySelect = useCallback(
    (entry: HistoryEntry) => {
      review.setCode(entry.code);
      review.setLanguage(entry.language);
      // Restore the review result directly
      // User can re-review if needed
    },
    [review]
  );

  const handleApplyFix = useCallback(
    (annotation: Annotation) => {
      fixer.applyAnnotationFix(annotation);
    },
    [fixer]
  );

  const totalFixable = useMemo(
    () => (review.review?.annotations.filter((a) => a.suggestion) || []).length,
    [review.review]
  );

  const showResults = review.review && !review.loading;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base font-semibold text-text-primary">
              AI Code Review
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <HistoryDropdown
              entries={history}
              onSelect={handleHistorySelect}
              onClear={() => setHistory([])}
            />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Input section */}
        <section>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <ModeToggle
              mode={review.mode}
              onModeChange={review.setMode}
              detectedMode={detectedMode}
            />
            <LanguageSelector
              value={review.language}
              onChange={review.setLanguage}
            />
            <ExampleLoader onLoad={handleLoadExample} />
          </div>

          <CodeInput value={review.code} onChange={review.setCode} />

          <div className="mt-4">
            <ReviewConfig
              focus={review.focus}
              onFocusChange={review.setFocus}
              context={review.context}
              onContextChange={review.setContext}
              strictness={review.strictness}
              onStrictnessChange={review.setStrictness}
              onSubmit={review.submitReview}
              loading={review.loading}
              codeLength={review.code.length}
            />
          </div>
        </section>

        {/* Error state */}
        <AnimatePresence>
          {review.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-bug/30 bg-bug/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-bug">{review.error}</p>
                  <button
                    onClick={review.submitReview}
                    className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        <AnimatePresence>
          {review.loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <div className="flex flex-col items-center gap-4 py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-text-primary">
                      Reviewing your code...
                    </p>
                    {review.streamSummary && (
                      <p className="mt-2 text-xs text-text-secondary max-w-md">
                        {review.streamSummary}
                      </p>
                    )}
                    {review.streamScore !== null && (
                      <p className="mt-1 text-xs text-accent">
                        Score: {review.streamScore}/100
                      </p>
                    )}
                    {review.streamAnnotations.length > 0 && (
                      <p className="mt-1 text-xs text-text-secondary">
                        Found {review.streamAnnotations.length} issues so far...
                      </p>
                    )}
                  </div>
                  {/* Skeleton lines */}
                  <div className="w-full max-w-md space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-3 rounded bg-bg-hover animate-pulse"
                        style={{ width: `${100 - i * 15}%` }}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {showResults && review.review && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Summary dashboard */}
              <SummaryDashboard
                review={review.review}
                onTopPriorityClick={() => {
                  if (review.review?.top_priority) {
                    const idx = review.review.annotations.findIndex(
                      (a) => a.line_start === review.review!.top_priority!.line_start
                    );
                    if (idx >= 0) {
                      annotations.toggleAnnotation(review.review.annotations[idx].id);
                    }
                  }
                }}
              />

              {/* Actions */}
              <SummaryActions
                review={review.review}
                appliedCount={fixer.appliedCount}
                totalFixable={totalFixable}
                onApplyAll={() => fixer.applyAll(review.review!.annotations)}
              />

              {/* Annotated code view */}
              {highlightedLines.length > 0 && !isHighlighting && (
                <AnnotatedCodeView
                  lines={highlightedLines}
                  annotations={annotations.visibleAnnotations}
                  expandedIds={annotations.expandedIds}
                  currentIndex={annotations.currentIndex}
                  appliedIds={fixer.appliedIds}
                  onToggleAnnotation={annotations.toggleAnnotation}
                  onDismiss={annotations.dismissAnnotation}
                  onApplyFix={handleApplyFix}
                  onPrev={annotations.prevAnnotation}
                  onNext={annotations.nextAnnotation}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!review.loading && !review.review && !review.error && (
          <div className="py-12 text-center">
            <p className="text-sm text-text-secondary">
              Paste code above and click <span className="text-accent font-medium">Review Code</span> to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
