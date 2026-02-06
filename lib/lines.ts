export interface NumberedCode {
  numbered: string;
  lineMap: Map<number, string>;
}

export function addLineNumbers(code: string): NumberedCode {
  const lines = code.split("\n");
  const lineMap = new Map<number, string>();
  const numberedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    lineMap.set(lineNum, lines[i]);
    numberedLines.push(`${lineNum}: ${lines[i]}`);
  }

  return {
    numbered: numberedLines.join("\n"),
    lineMap,
  };
}
