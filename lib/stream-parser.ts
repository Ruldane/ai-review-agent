import type { ReviewResult, Annotation } from "@/types";

export interface StreamUpdate {
  summary?: string;
  score?: number;
  verdict?: string;
  annotations: Annotation[];
  complete: boolean;
  raw: string;
}

export class StreamParser {
  private buffer = "";
  private annotationCount = 0;

  feed(chunk: string): StreamUpdate {
    this.buffer += chunk;

    const update: StreamUpdate = {
      annotations: [],
      complete: false,
      raw: this.buffer,
    };

    // Try to extract summary
    const summaryMatch = this.buffer.match(/"summary"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (summaryMatch) {
      update.summary = unescapeJson(summaryMatch[1]);
    }

    // Try to extract score
    const scoreMatch = this.buffer.match(/"score"\s*:\s*(\d+)/);
    if (scoreMatch) {
      update.score = parseInt(scoreMatch[1], 10);
    }

    // Try to extract verdict
    const verdictMatch = this.buffer.match(/"verdict"\s*:\s*"(\w+)"/);
    if (verdictMatch) {
      update.verdict = verdictMatch[1];
    }

    // Try to extract complete annotations
    const annotationsRegex = /\{[^{}]*"line_start"\s*:\s*\d+[^{}]*"title"\s*:\s*"(?:[^"\\]|\\.)*"[^{}]*\}/g;
    let match;
    const annotations: Annotation[] = [];

    while ((match = annotationsRegex.exec(this.buffer)) !== null) {
      try {
        const parsed = JSON.parse(match[0]);
        if (parsed.line_start && parsed.category && parsed.severity && parsed.title) {
          annotations.push({
            id: `ann-${++this.annotationCount}`,
            line_start: parsed.line_start,
            line_end: parsed.line_end ?? parsed.line_start,
            category: parsed.category,
            severity: parsed.severity,
            title: parsed.title,
            description: parsed.description ?? "",
            suggestion: parsed.suggestion,
            reference_url: parsed.reference_url,
          });
        }
      } catch {
        // Incomplete JSON, skip
      }
    }

    update.annotations = annotations;

    // Check if response is complete (valid full JSON)
    try {
      const cleaned = this.buffer.trim();
      JSON.parse(cleaned);
      update.complete = true;
    } catch {
      // Not yet complete
    }

    return update;
  }

  getResult(): ReviewResult | null {
    try {
      // Strip markdown code fences if present
      let cleaned = this.buffer.trim();

      // Remove ```json or ``` at start
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.substring(7);
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.substring(3);
      }

      // Remove ``` at end
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }

      cleaned = cleaned.trim();

      const parsed = JSON.parse(cleaned);
      const annotations: Annotation[] = (parsed.annotations || []).map(
        (a: Record<string, unknown>, i: number) => ({
          id: `ann-${i + 1}`,
          line_start: a.line_start as number,
          line_end: (a.line_end as number) ?? (a.line_start as number),
          category: a.category as string,
          severity: a.severity as string,
          title: a.title as string,
          description: (a.description as string) ?? "",
          suggestion: a.suggestion as string | undefined,
          reference_url: a.reference_url as string | undefined,
        })
      );

      const stats = {
        bugs: annotations.filter((a) => a.category === "bug").length,
        security: annotations.filter((a) => a.category === "security").length,
        performance: annotations.filter((a) => a.category === "performance").length,
        style: annotations.filter((a) => a.category === "style").length,
        critical: annotations.filter((a) => a.severity === "critical").length,
        warnings: annotations.filter((a) => a.severity === "warning").length,
        info: annotations.filter((a) => a.severity === "info").length,
        praise: annotations.filter((a) => a.severity === "praise").length,
      };

      const topPriority = parsed.top_priority
        ? {
            id: "top-priority",
            line_start: parsed.top_priority.line_start,
            line_end: parsed.top_priority.line_end ?? parsed.top_priority.line_start,
            category: parsed.top_priority.category,
            severity: parsed.top_priority.severity,
            title: parsed.top_priority.title,
            description: parsed.top_priority.description ?? "",
            suggestion: parsed.top_priority.suggestion,
          }
        : null;

      return {
        summary: parsed.summary ?? "",
        score: parsed.score ?? 0,
        verdict: parsed.verdict ?? "needs_changes",
        annotations,
        stats,
        top_priority: topPriority,
      };
    } catch {
      return null;
    }
  }

  reset(): void {
    this.buffer = "";
    this.annotationCount = 0;
  }

  getRawBuffer(): string {
    return this.buffer;
  }
}

function unescapeJson(str: string): string {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}
