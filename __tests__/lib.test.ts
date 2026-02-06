import { describe, it, expect } from "vitest";
import { addLineNumbers } from "@/lib/lines";
import { detectMode } from "@/lib/detect-mode";
import { detectLanguage } from "@/lib/detect-language";
import { parseDiff } from "@/lib/diff-parser";

describe("addLineNumbers", () => {
  it("adds line numbers to code", () => {
    const result = addLineNumbers("const x = 1;\nconst y = 2;");
    expect(result.numbered).toBe("1: const x = 1;\n2: const y = 2;");
  });

  it("creates correct lineMap", () => {
    const result = addLineNumbers("hello\nworld");
    expect(result.lineMap.get(1)).toBe("hello");
    expect(result.lineMap.get(2)).toBe("world");
  });

  it("handles empty lines", () => {
    const result = addLineNumbers("a\n\nb");
    expect(result.numbered).toBe("1: a\n2: \n3: b");
    expect(result.lineMap.get(2)).toBe("");
  });

  it("handles single line", () => {
    const result = addLineNumbers("single");
    expect(result.numbered).toBe("1: single");
    expect(result.lineMap.size).toBe(1);
  });
});

describe("detectMode", () => {
  it("detects unified diff", () => {
    const diff = `--- a/file.ts
+++ b/file.ts
@@ -1,5 +1,5 @@
 const x = 1;
-const y = 2;
+const y = 3;
 const z = 4;`;
    expect(detectMode(diff)).toBe("diff");
  });

  it("detects plain code", () => {
    const code = `function hello() {
  console.log("hello");
}`;
    expect(detectMode(code)).toBe("code");
  });

  it("defaults to code for ambiguous input", () => {
    expect(detectMode("hello world")).toBe("code");
  });
});

describe("detectLanguage", () => {
  it("detects Python", () => {
    const code = `def hello():
    print("hello")
    return True`;
    expect(detectLanguage(code)).toBe("python");
  });

  it("detects TypeScript", () => {
    const code = `interface User {
  name: string;
  age: number;
}`;
    expect(detectLanguage(code)).toBe("typescript");
  });

  it("detects Go", () => {
    const code = `package main

func main() {
    fmt.Println("hello")
}`;
    expect(detectLanguage(code)).toBe("go");
  });

  it("detects JavaScript", () => {
    const code = `const express = require('express');
const app = express();
function handler() {}`;
    expect(detectLanguage(code)).toBe("javascript");
  });

  it("detects SQL", () => {
    const code = `SELECT id, name FROM users
WHERE age > 18
ORDER BY name;`;
    expect(detectLanguage(code)).toBe("sql");
  });

  it("returns plaintext for unknown", () => {
    expect(detectLanguage("hello world")).toBe("plaintext");
  });
});

describe("parseDiff", () => {
  it("parses unified diff", () => {
    const diff = `--- a/file.ts
+++ b/file.ts
@@ -1,3 +1,3 @@
 const x = 1;
-const y = 2;
+const y = 3;
 const z = 4;`;

    const result = parseDiff(diff);
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({
      type: "unchanged",
      content: "const x = 1;",
      oldLine: 1,
      newLine: 1,
    });
    expect(result[1]).toEqual({
      type: "removed",
      content: "const y = 2;",
      oldLine: 2,
      newLine: null,
    });
    expect(result[2]).toEqual({
      type: "added",
      content: "const y = 3;",
      oldLine: null,
      newLine: 2,
    });
    expect(result[3]).toEqual({
      type: "unchanged",
      content: "const z = 4;",
      oldLine: 3,
      newLine: 3,
    });
  });

  it("handles multiple hunks", () => {
    const diff = `@@ -1,2 +1,2 @@
-old1
+new1
@@ -10,2 +10,2 @@
-old2
+new2`;

    const result = parseDiff(diff);
    expect(result).toHaveLength(4);
    expect(result[0].oldLine).toBe(1);
    expect(result[2].oldLine).toBe(10);
  });
});
