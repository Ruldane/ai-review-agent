"use client";

import { useState, useCallback, useMemo } from "react";
import type { Annotation } from "@/types";

interface UseAnnotationsReturn {
  expandedIds: Set<string>;
  dismissedIds: Set<string>;
  currentIndex: number;
  visibleAnnotations: Annotation[];
  toggleAnnotation: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  dismissAnnotation: (id: string) => void;
  nextAnnotation: () => void;
  prevAnnotation: () => void;
  setAnnotations: (annotations: Annotation[]) => void;
}

export function useAnnotations(): UseAnnotationsReturn {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleAnnotations = useMemo(
    () => annotations.filter((a) => !dismissedIds.has(a.id)),
    [annotations, dismissedIds]
  );

  const toggleAnnotation = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedIds(new Set(visibleAnnotations.map((a) => a.id)));
  }, [visibleAnnotations]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const dismissAnnotation = useCallback((id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const nextAnnotation = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < visibleAnnotations.length - 1 ? prev + 1 : prev
    );
  }, [visibleAnnotations.length]);

  const prevAnnotation = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleSetAnnotations = useCallback((newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
    setExpandedIds(new Set());
    setDismissedIds(new Set());
    setCurrentIndex(0);
  }, []);

  return {
    expandedIds,
    dismissedIds,
    currentIndex,
    visibleAnnotations,
    toggleAnnotation,
    expandAll,
    collapseAll,
    dismissAnnotation,
    nextAnnotation,
    prevAnnotation,
    setAnnotations: handleSetAnnotations,
  };
}
