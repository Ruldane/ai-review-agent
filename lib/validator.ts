import type { Annotation, Category, Severity } from "@/types";

const VALID_CATEGORIES: Category[] = ["bug", "security", "performance", "style"];
const VALID_SEVERITIES: Severity[] = ["critical", "warning", "info", "praise"];

const severityOrder: Record<Severity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
  praise: 3,
};

export function validateAnnotations(
  annotations: Annotation[],
  maxLines: number
): Annotation[] {
  const validated: Annotation[] = [];
  const seen = new Set<string>();

  for (const annotation of annotations) {
    // Validate category
    if (!VALID_CATEGORIES.includes(annotation.category)) continue;

    // Validate severity
    if (!VALID_SEVERITIES.includes(annotation.severity)) continue;

    // Clamp line numbers
    const lineStart = Math.max(1, Math.min(annotation.line_start, maxLines));
    const lineEnd = Math.max(lineStart, Math.min(annotation.line_end, maxLines));

    // Deduplicate by line + category
    const key = `${lineStart}-${annotation.category}`;
    if (seen.has(key)) continue;
    seen.add(key);

    validated.push({
      ...annotation,
      line_start: lineStart,
      line_end: lineEnd,
    });
  }

  // Sort by severity (critical first)
  validated.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return validated;
}
