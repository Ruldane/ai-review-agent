import { describe, it, expect } from "vitest";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai";
import { StreamParser } from "@/lib/stream-parser";
import { validateAnnotations } from "@/lib/validator";
import { applyFix, applyAllFixes } from "@/lib/fixer";
import { generateMarkdown } from "@/lib/markdown-export";
import type { Annotation, ReviewResult } from "@/types";

describe("buildSystemPrompt", () => {
  it("returns a non-empty string", () => {
    const prompt = buildSystemPrompt();
    expect(prompt.length).toBeGreaterThan(100);
  });

  it("includes JSON format instructions", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("annotations");
    expect(prompt).toContain("score");
    expect(prompt).toContain("verdict");
  });
});

describe("buildUserPrompt", () => {
  it("includes the code", () => {
    const prompt = buildUserPrompt("1: hello", "python", "code", ["bug"], "", "medium");
    expect(prompt).toContain("1: hello");
  });

  it("includes focus categories", () => {
    const prompt = buildUserPrompt("1: x", "js", "code", ["bug", "security"], "", "medium");
    expect(prompt).toContain("bug, security");
  });

  it("includes strictness", () => {
    const prompt = buildUserPrompt("1: x", "js", "code", ["bug"], "", "strict");
    expect(prompt).toContain("strict");
  });

  it("includes context when provided", () => {
    const prompt = buildUserPrompt("1: x", "js", "code", ["bug"], "API handler", "medium");
    expect(prompt).toContain("API handler");
  });
});

describe("StreamParser", () => {
  it("extracts summary from partial JSON", () => {
    const parser = new StreamParser();
    const update = parser.feed('{"summary": "Good code overall"');
    expect(update.summary).toBe("Good code overall");
  });

  it("extracts score", () => {
    const parser = new StreamParser();
    const update = parser.feed('{"summary": "OK", "score": 85');
    expect(update.score).toBe(85);
  });

  it("detects completion", () => {
    const parser = new StreamParser();
    const update = parser.feed('{"summary": "OK", "score": 85, "verdict": "ship_it", "annotations": [], "top_priority": null}');
    expect(update.complete).toBe(true);
  });

  it("parses full result", () => {
    const parser = new StreamParser();
    parser.feed(JSON.stringify({
      summary: "Good code",
      score: 90,
      verdict: "ship_it",
      annotations: [
        { line_start: 1, line_end: 1, category: "style", severity: "info", title: "Naming", description: "Use better names" },
      ],
      top_priority: null,
    }));
    const result = parser.getResult();
    expect(result).not.toBeNull();
    expect(result!.score).toBe(90);
    expect(result!.annotations).toHaveLength(1);
  });
});

describe("validateAnnotations", () => {
  const makeAnnotation = (overrides: Partial<Annotation> = {}): Annotation => ({
    id: "1",
    line_start: 1,
    line_end: 1,
    category: "bug",
    severity: "warning",
    title: "Test",
    description: "Test desc",
    ...overrides,
  });

  it("clamps line numbers", () => {
    const result = validateAnnotations([makeAnnotation({ line_start: 0, line_end: 100 })], 10);
    expect(result[0].line_start).toBe(1);
    expect(result[0].line_end).toBe(10);
  });

  it("removes invalid categories", () => {
    const result = validateAnnotations(
      [makeAnnotation({ category: "invalid" as never })],
      10
    );
    expect(result).toHaveLength(0);
  });

  it("deduplicates by line + category", () => {
    const result = validateAnnotations(
      [
        makeAnnotation({ id: "1", line_start: 5 }),
        makeAnnotation({ id: "2", line_start: 5 }),
      ],
      10
    );
    expect(result).toHaveLength(1);
  });

  it("sorts by severity", () => {
    const result = validateAnnotations(
      [
        makeAnnotation({ id: "1", severity: "info", line_start: 1 }),
        makeAnnotation({ id: "2", severity: "critical", line_start: 2, category: "security" }),
        makeAnnotation({ id: "3", severity: "warning", line_start: 3, category: "performance" }),
      ],
      10
    );
    expect(result[0].severity).toBe("critical");
    expect(result[1].severity).toBe("warning");
    expect(result[2].severity).toBe("info");
  });
});

describe("applyFix", () => {
  it("replaces a single line", () => {
    const code = "line1\nline2\nline3";
    const annotation = makeAnnotation({ line_start: 2, line_end: 2, suggestion: "newline2" });
    expect(applyFix(code, annotation)).toBe("line1\nnewline2\nline3");
  });

  it("replaces multiple lines", () => {
    const code = "line1\nline2\nline3\nline4";
    const annotation = makeAnnotation({ line_start: 2, line_end: 3, suggestion: "replaced" });
    expect(applyFix(code, annotation)).toBe("line1\nreplaced\nline4");
  });

  it("returns original code if no suggestion", () => {
    const code = "line1\nline2";
    const annotation = makeAnnotation({ line_start: 1, line_end: 1 });
    expect(applyFix(code, annotation)).toBe(code);
  });
});

describe("applyAllFixes", () => {
  it("applies fixes bottom to top", () => {
    const code = "a\nb\nc";
    const annotations = [
      makeAnnotation({ id: "1", line_start: 1, line_end: 1, suggestion: "A" }),
      makeAnnotation({ id: "2", line_start: 3, line_end: 3, suggestion: "C", category: "security" }),
    ];
    expect(applyAllFixes(code, annotations)).toBe("A\nb\nC");
  });
});

describe("generateMarkdown", () => {
  it("includes score and verdict", () => {
    const review: ReviewResult = {
      summary: "Good code",
      score: 85,
      verdict: "ship_it",
      annotations: [],
      stats: { bugs: 0, security: 0, performance: 0, style: 0, critical: 0, warnings: 0, info: 0, praise: 0 },
      top_priority: null,
    };
    const md = generateMarkdown(review);
    expect(md).toContain("85/100");
    expect(md).toContain("SHIP IT");
  });

  it("includes annotations", () => {
    const review: ReviewResult = {
      summary: "Issues found",
      score: 60,
      verdict: "needs_changes",
      annotations: [
        {
          id: "1",
          line_start: 5,
          line_end: 5,
          category: "bug",
          severity: "warning",
          title: "Null check missing",
          description: "Variable may be null",
          suggestion: "if (x != null) {",
        },
      ],
      stats: { bugs: 1, security: 0, performance: 0, style: 0, critical: 0, warnings: 1, info: 0, praise: 0 },
      top_priority: null,
    };
    const md = generateMarkdown(review);
    expect(md).toContain("Null check missing");
    expect(md).toContain("Line 5");
    expect(md).toContain("Suggested fix:");
  });
});

function makeAnnotation(overrides: Partial<Annotation> = {}): Annotation {
  return {
    id: "1",
    line_start: 1,
    line_end: 1,
    category: "bug",
    severity: "warning",
    title: "Test",
    description: "Test desc",
    ...overrides,
  };
}
