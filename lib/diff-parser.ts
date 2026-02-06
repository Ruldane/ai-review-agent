import type { DiffLine } from "@/types";

export function parseDiff(diffText: string): DiffLine[] {
  const lines = diffText.split("\n");
  const result: DiffLine[] = [];
  let oldLine = 0;
  let newLine = 0;

  for (const line of lines) {
    // Skip diff metadata lines
    if (line.startsWith("diff ") || line.startsWith("index ")) continue;
    if (line.startsWith("---") || line.startsWith("+++")) continue;

    // Parse hunk header
    if (line.startsWith("@@")) {
      const match = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (match) {
        oldLine = parseInt(match[1], 10) - 1;
        newLine = parseInt(match[2], 10) - 1;
      }
      continue;
    }

    if (line.startsWith("+")) {
      newLine++;
      result.push({
        type: "added",
        content: line.slice(1),
        oldLine: null,
        newLine,
      });
    } else if (line.startsWith("-")) {
      oldLine++;
      result.push({
        type: "removed",
        content: line.slice(1),
        oldLine,
        newLine: null,
      });
    } else {
      // Context line (starts with space or is empty)
      oldLine++;
      newLine++;
      result.push({
        type: "unchanged",
        content: line.startsWith(" ") ? line.slice(1) : line,
        oldLine,
        newLine,
      });
    }
  }

  return result;
}
