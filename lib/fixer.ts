import type { Annotation } from "@/types";

export function applyFix(code: string, annotation: Annotation): string {
  if (!annotation.suggestion) return code;

  const lines = code.split("\n");
  const start = annotation.line_start - 1;
  const end = annotation.line_end;
  const suggestionLines = annotation.suggestion.split("\n");

  lines.splice(start, end - start, ...suggestionLines);

  return lines.join("\n");
}

export function applyAllFixes(code: string, annotations: Annotation[]): string {
  // Sort by line_start descending so we apply from bottom to top
  const fixable = annotations
    .filter((a) => a.suggestion)
    .sort((a, b) => b.line_start - a.line_start);

  let result = code;
  for (const annotation of fixable) {
    result = applyFix(result, annotation);
  }

  return result;
}
