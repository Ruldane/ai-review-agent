"use client";

import { useState, useCallback } from "react";
import { applyFix, applyAllFixes } from "@/lib/fixer";
import type { Annotation } from "@/types";

interface UseFixerReturn {
  currentCode: string;
  appliedIds: Set<string>;
  appliedCount: number;
  totalFixable: number;
  initCode: (code: string) => void;
  applyAnnotationFix: (annotation: Annotation) => void;
  applyAll: (annotations: Annotation[]) => void;
  undo: () => void;
  canUndo: boolean;
}

interface UndoEntry {
  code: string;
  appliedIds: Set<string>;
  timestamp: number;
}

const UNDO_TIMEOUT = 5000;

export function useFixer(): UseFixerReturn {
  const [currentCode, setCurrentCode] = useState("");
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);

  const initCode = useCallback((code: string) => {
    setCurrentCode(code);
    setAppliedIds(new Set());
    setUndoStack([]);
  }, []);

  const applyAnnotationFix = useCallback((annotation: Annotation) => {
    if (!annotation.suggestion || appliedIds.has(annotation.id)) return;

    setUndoStack((prev) => [
      ...prev,
      { code: currentCode, appliedIds: new Set(appliedIds), timestamp: Date.now() },
    ]);

    const newCode = applyFix(currentCode, annotation);
    setCurrentCode(newCode);
    setAppliedIds((prev) => new Set(prev).add(annotation.id));
  }, [currentCode, appliedIds]);

  const applyAll = useCallback((annotations: Annotation[]) => {
    const fixable = annotations.filter((a) => a.suggestion && !appliedIds.has(a.id));
    if (fixable.length === 0) return;

    setUndoStack((prev) => [
      ...prev,
      { code: currentCode, appliedIds: new Set(appliedIds), timestamp: Date.now() },
    ]);

    const newCode = applyAllFixes(currentCode, fixable);
    setCurrentCode(newCode);
    setAppliedIds((prev) => {
      const next = new Set(prev);
      fixable.forEach((a) => next.add(a.id));
      return next;
    });
  }, [currentCode, appliedIds]);

  const undo = useCallback(() => {
    setUndoStack((prev) => {
      if (prev.length === 0) return prev;
      const entry = prev[prev.length - 1];
      if (Date.now() - entry.timestamp > UNDO_TIMEOUT) {
        return [];
      }
      setCurrentCode(entry.code);
      setAppliedIds(entry.appliedIds);
      return prev.slice(0, -1);
    });
  }, []);

  return {
    currentCode,
    appliedIds,
    appliedCount: appliedIds.size,
    totalFixable: 0,
    initCode,
    applyAnnotationFix,
    applyAll,
    undo,
    canUndo: undoStack.length > 0,
  };
}
