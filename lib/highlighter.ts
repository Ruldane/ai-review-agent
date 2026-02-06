import { createHighlighter, type Highlighter } from "shiki";
import type { HighlightedLine } from "@/types";

let highlighterPromise: Promise<Highlighter> | null = null;

const preloadLangs = [
  "javascript", "typescript", "python", "go", "rust",
  "java", "cpp", "csharp", "ruby", "php",
] as const;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: [...preloadLangs],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  language: string
): Promise<{ lines: HighlightedLine[] }> {
  const highlighter = await getHighlighter();
  const loadedLangs = highlighter.getLoadedLanguages();

  let lang = language;
  if (!loadedLangs.includes(lang as never)) {
    try {
      await highlighter.loadLanguage(lang as never);
    } catch {
      lang = "plaintext";
    }
  }

  // Parse the code to extract individual highlighted lines
  const codeLines = code.split("\n");
  const lines: HighlightedLine[] = codeLines.map((_, index) => {
    // Re-highlight each line individually for per-line HTML
    const lineHtml = highlighter.codeToHtml(codeLines[index] || "", {
      lang,
      theme: "github-dark",
    });

    // Extract just the inner content from the shiki wrapper
    const match = lineHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/);
    const innerHtml = match ? match[1] : codeLines[index];

    // Remove the line wrapper span if present
    const cleaned = innerHtml.replace(/<span class="line">([\s\S]*?)<\/span>/, "$1");

    return {
      number: index + 1,
      html: cleaned || "&nbsp;",
    };
  });

  return { lines };
}
