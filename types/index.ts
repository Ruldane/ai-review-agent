export type Category = "bug" | "security" | "performance" | "style";
export type Severity = "critical" | "warning" | "info" | "praise";
export type Verdict = "ship_it" | "needs_changes" | "request_changes" | "blocked";
export type InputMode = "code" | "diff";
export type Strictness = "lenient" | "medium" | "strict";

export interface Annotation {
  id: string;
  line_start: number;
  line_end: number;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  suggestion?: string;
  reference_url?: string;
}

export interface ReviewStats {
  bugs: number;
  security: number;
  performance: number;
  style: number;
  critical: number;
  warnings: number;
  info: number;
  praise: number;
}

export interface ReviewResult {
  summary: string;
  score: number;
  verdict: Verdict;
  annotations: Annotation[];
  stats: ReviewStats;
  top_priority: Annotation | null;
}

export interface ReviewRequest {
  code: string;
  language: string;
  mode: InputMode;
  focus: Category[];
  context: string;
  strictness: Strictness;
}

export interface HistoryEntry {
  id: string;
  code: string;
  language: string;
  result: ReviewResult;
  timestamp: number;
}

export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLine: number | null;
  newLine: number | null;
}

export interface HighlightedLine {
  number: number;
  html: string;
}
