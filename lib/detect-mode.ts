import type { InputMode } from "@/types";

export function detectMode(content: string): InputMode {
  const lines = content.split("\n");

  let diffIndicators = 0;

  for (const line of lines) {
    if (line.startsWith("---") || line.startsWith("+++")) diffIndicators += 2;
    else if (line.startsWith("@@") && line.includes("@@")) diffIndicators += 3;
    else if (line.startsWith("+") && !line.startsWith("+++")) diffIndicators++;
    else if (line.startsWith("-") && !line.startsWith("---")) diffIndicators++;
  }

  // Need at least a few diff indicators to consider it a diff
  if (diffIndicators >= 4) return "diff";

  return "code";
}
