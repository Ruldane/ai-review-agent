const patterns: Array<{ id: string; patterns: RegExp[] }> = [
  {
    id: "typescript",
    patterns: [
      /\binterface\s+\w+/,
      /:\s*(string|number|boolean|any)\b/,
      /\btype\s+\w+\s*=/,
      /\bas\s+(string|number|any)\b/,
      /<\w+>/,
    ],
  },
  {
    id: "javascript",
    patterns: [
      /\bconst\s+\w+\s*=/,
      /\bfunction\s+\w+/,
      /=>\s*[{(]/,
      /\brequire\s*\(/,
      /\bmodule\.exports\b/,
    ],
  },
  {
    id: "python",
    patterns: [
      /\bdef\s+\w+\s*\(/,
      /\bclass\s+\w+.*:/,
      /\bimport\s+\w+/,
      /\bfrom\s+\w+\s+import\b/,
      /\bself\./,
      /\bprint\s*\(/,
      /\b(True|False|None)\b/,
    ],
  },
  {
    id: "go",
    patterns: [
      /\bfunc\s+(\(\w+\s+\*?\w+\)\s+)?\w+\s*\(/,
      /\bpackage\s+\w+/,
      /\bfmt\.Print/,
      /:=\s*/,
      /\bgo\s+func\b/,
    ],
  },
  {
    id: "rust",
    patterns: [
      /\bfn\s+\w+/,
      /\blet\s+mut\b/,
      /\bimpl\s+\w+/,
      /\buse\s+\w+::\w+/,
      /\bmatch\s+\w+\s*\{/,
    ],
  },
  {
    id: "java",
    patterns: [
      /\bpublic\s+(static\s+)?class\b/,
      /\bSystem\.out\.print/,
      /\bpublic\s+static\s+void\s+main\b/,
      /\bimport\s+java\./,
    ],
  },
  {
    id: "csharp",
    patterns: [
      /\busing\s+System/,
      /\bnamespace\s+\w+/,
      /\bpublic\s+(async\s+)?Task\b/,
      /\bvar\s+\w+\s*=\s*new\b/,
    ],
  },
  {
    id: "ruby",
    patterns: [
      /\bdef\s+\w+/,
      /\bend\s*$/m,
      /\bputs\s+/,
      /\brequire\s+['"]/,
      /\battr_accessor\b/,
    ],
  },
  {
    id: "php",
    patterns: [
      /<\?php/,
      /\$\w+\s*=/,
      /\bfunction\s+\w+\s*\(/,
      /\becho\s+/,
    ],
  },
  {
    id: "swift",
    patterns: [
      /\bfunc\s+\w+\s*\(/,
      /\bvar\s+\w+\s*:\s*\w+/,
      /\blet\s+\w+\s*:\s*\w+/,
      /\bguard\s+let\b/,
      /\bimport\s+UIKit/,
    ],
  },
  {
    id: "kotlin",
    patterns: [
      /\bfun\s+\w+/,
      /\bval\s+\w+/,
      /\bvar\s+\w+/,
      /\bdata\s+class\b/,
      /\bimport\s+kotlin\./,
    ],
  },
  {
    id: "sql",
    patterns: [
      /\bSELECT\b/i,
      /\bFROM\b/i,
      /\bWHERE\b/i,
      /\bINSERT\s+INTO\b/i,
      /\bCREATE\s+TABLE\b/i,
      /\bORDER\s+BY\b/i,
    ],
  },
  {
    id: "html",
    patterns: [
      /<!DOCTYPE\s+html>/i,
      /<html[\s>]/,
      /<div[\s>]/,
      /<\/\w+>/,
    ],
  },
  {
    id: "css",
    patterns: [
      /\w+\s*\{[\s\S]*?:\s*[\w#]+;/,
      /@media\s*\(/,
      /\.\w+\s*\{/,
      /#\w+\s*\{/,
    ],
  },
  {
    id: "bash",
    patterns: [
      /^#!/,
      /\becho\s+/,
      /\bif\s+\[\s/,
      /\bfi\s*$/m,
      /\|\s*grep\b/,
    ],
  },
  {
    id: "yaml",
    patterns: [
      /^\w+:\s*$/m,
      /^\s+-\s+\w+/m,
      /^\w+:\s+\w+/m,
    ],
  },
  {
    id: "json",
    patterns: [
      /^\s*\{[\s\S]*"[\w]+"\s*:/,
      /^\s*\[[\s\S]*\{/,
    ],
  },
  {
    id: "dockerfile",
    patterns: [
      /^FROM\s+\w+/m,
      /^RUN\s+/m,
      /^COPY\s+/m,
      /^CMD\s+/m,
    ],
  },
];

export function detectLanguage(code: string): string {
  let bestMatch = "plaintext";
  let bestScore = 0;

  for (const lang of patterns) {
    let score = 0;
    for (const pattern of lang.patterns) {
      if (pattern.test(code)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = lang.id;
    }
  }

  return bestScore >= 2 ? bestMatch : "plaintext";
}
