"use client";

import { useState, useCallback } from "react";
import { StreamParser } from "@/lib/stream-parser";
import { validateAnnotations } from "@/lib/validator";
import { detectMode } from "@/lib/detect-mode";
import { detectLanguage } from "@/lib/detect-language";
import type {
  ReviewResult,
  ReviewRequest,
  Annotation,
  Category,
  Strictness,
  InputMode,
} from "@/types";

interface UseReviewReturn {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  mode: InputMode;
  setMode: (mode: InputMode) => void;
  focus: Category[];
  setFocus: (focus: Category[]) => void;
  context: string;
  setContext: (ctx: string) => void;
  strictness: Strictness;
  setStrictness: (s: Strictness) => void;
  review: ReviewResult | null;
  streamAnnotations: Annotation[];
  streamSummary: string;
  streamScore: number | null;
  loading: boolean;
  error: string | null;
  submitReview: () => Promise<void>;
  reset: () => void;
}

export function useReview(): UseReviewReturn {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("auto");
  const [mode, setMode] = useState<InputMode>("code");
  const [focus, setFocus] = useState<Category[]>(["bug", "security", "performance", "style"]);
  const [context, setContext] = useState("");
  const [strictness, setStrictness] = useState<Strictness>("medium");
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [streamAnnotations, setStreamAnnotations] = useState<Annotation[]>([]);
  const [streamSummary, setStreamSummary] = useState("");
  const [streamScore, setStreamScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = useCallback(async () => {
    if (code.trim().length < 10) return;

    setLoading(true);
    setError(null);
    setReview(null);
    setStreamAnnotations([]);
    setStreamSummary("");
    setStreamScore(null);

    const detectedMode = mode === "code" ? detectMode(code) : mode;
    const detectedLang = language === "auto" ? detectLanguage(code) : language;

    const body: ReviewRequest = {
      code,
      language: detectedLang,
      mode: detectedMode,
      focus,
      context,
      strictness,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      const parser = new StreamParser();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        textBuffer += chunk;

        // Parse SSE events
        const lines = textBuffer.split("\n");
        textBuffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const event = JSON.parse(data);
            if (event.type === "content_block_delta" && event.delta?.text) {
              const update = parser.feed(event.delta.text);

              if (update.summary) setStreamSummary(update.summary);
              if (update.score !== undefined) setStreamScore(update.score);
              if (update.annotations.length > 0) {
                setStreamAnnotations(update.annotations);
              }
            }
          } catch {
            // Skip unparseable events
          }
        }
      }

      const result = parser.getResult();
      if (result) {
        const lineCount = code.split("\n").length;
        result.annotations = validateAnnotations(result.annotations, lineCount);
        setReview(result);
      } else {
        // Log the raw buffer for debugging
        const rawBuffer = parser.getRawBuffer();
        console.error("Failed to parse review response. Raw buffer length:", rawBuffer.length);
        console.error("Raw buffer preview (first 500 chars):", rawBuffer.substring(0, 500));
        console.error("Raw buffer preview (last 500 chars):", rawBuffer.substring(Math.max(0, rawBuffer.length - 500)));
        throw new Error("Failed to parse review response");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Review timed out. Try a shorter code snippet.");
      } else {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [code, language, mode, focus, context, strictness]);

  const reset = useCallback(() => {
    setCode("");
    setLanguage("auto");
    setMode("code");
    setFocus(["bug", "security", "performance", "style"]);
    setContext("");
    setStrictness("medium");
    setReview(null);
    setStreamAnnotations([]);
    setStreamSummary("");
    setStreamScore(null);
    setError(null);
  }, []);

  return {
    code,
    setCode,
    language,
    setLanguage,
    mode,
    setMode,
    focus,
    setFocus,
    context,
    setContext,
    strictness,
    setStrictness,
    review,
    streamAnnotations,
    streamSummary,
    streamScore,
    loading,
    error,
    submitReview,
    reset,
  };
}
