"use client";

import { useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeLine } from "./CodeLine";
import { GutterDot } from "./GutterDot";
import { AnnotationCard } from "./AnnotationCard";
import { AnnotationNav } from "./AnnotationNav";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { Annotation, HighlightedLine } from "@/types";

export interface AnnotatedCodeViewProps {
  lines: HighlightedLine[];
  annotations: Annotation[];
  expandedIds: Set<string>;
  currentIndex: number;
  appliedIds: Set<string>;
  onToggleAnnotation: (id: string) => void;
  onDismiss: (id: string) => void;
  onApplyFix: (annotation: Annotation) => void;
  onPrev: () => void;
  onNext: () => void;
  diffType?: Map<number, "added" | "removed" | "unchanged">;
  className?: string;
}

export function AnnotatedCodeView({
  lines,
  annotations,
  expandedIds,
  currentIndex,
  appliedIds,
  onToggleAnnotation,
  onDismiss,
  onApplyFix,
  onPrev,
  onNext,
  diffType,
  className,
}: AnnotatedCodeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Build line -> annotations map
  const lineAnnotations = useMemo(() => {
    const map = new Map<number, Annotation[]>();
    for (const ann of annotations) {
      for (let line = ann.line_start; line <= ann.line_end; line++) {
        if (!map.has(line)) map.set(line, []);
        map.get(line)!.push(ann);
      }
    }
    return map;
  }, [annotations]);

  // Scroll to current annotation
  const scrollToAnnotation = useCallback((annotation: Annotation) => {
    const el = containerRef.current?.querySelector(
      `[data-line-number="${annotation.line_start}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    const current = annotations[currentIndex];
    if (current) {
      scrollToAnnotation(current);
    }
  }, [currentIndex, annotations, scrollToAnnotation]);

  // Track which lines should show annotations (first line of range)
  const annotationStartLines = useMemo(() => {
    const map = new Map<number, Annotation[]>();
    for (const ann of annotations) {
      if (!map.has(ann.line_start)) map.set(ann.line_start, []);
      map.get(ann.line_start)!.push(ann);
    }
    return map;
  }, [annotations]);

  // Gutter dot index counter
  let dotIndex = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className={cn("overflow-hidden p-0", className)}>
        <div ref={containerRef} className="overflow-x-auto">
          {lines.map((line) => {
            const lineAnns = lineAnnotations.get(line.number) || [];
            const startAnns = annotationStartLines.get(line.number) || [];
            const isActive = annotations[currentIndex]?.line_start === line.number;
            const currentDotIndex = dotIndex;
            if (startAnns.length > 0) dotIndex++;

            return (
              <div key={line.number}>
                <div className="flex items-center">
                  {/* Gutter dot area */}
                  <div className="w-6 shrink-0 flex items-center justify-center">
                    {startAnns.length > 0 && (
                      <GutterDot
                        annotations={startAnns}
                        expanded={startAnns.some((a) => expandedIds.has(a.id))}
                        onClick={() => {
                          startAnns.forEach((a) => onToggleAnnotation(a.id));
                        }}
                        index={currentDotIndex}
                      />
                    )}
                  </div>

                  {/* Code line */}
                  <div className="flex-1 min-w-0">
                    <CodeLine
                      lineNumber={line.number}
                      html={line.html}
                      annotations={lineAnns}
                      isActive={isActive}
                      diffType={diffType?.get(line.number)}
                      onClick={() => {
                        if (startAnns.length > 0) {
                          startAnns.forEach((a) => onToggleAnnotation(a.id));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Annotation cards */}
                <AnimatePresence>
                  {startAnns
                    .filter((a) => expandedIds.has(a.id))
                    .map((ann) => (
                      <AnnotationCard
                        key={ann.id}
                        annotation={ann}
                        isApplied={appliedIds.has(ann.id)}
                        onApplyFix={() => onApplyFix(ann)}
                        onDismiss={() => onDismiss(ann.id)}
                      />
                    ))}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Navigation */}
      <AnnotationNav
        currentIndex={currentIndex}
        total={annotations.length}
        onPrev={onPrev}
        onNext={onNext}
      />
    </motion.div>
  );
}
