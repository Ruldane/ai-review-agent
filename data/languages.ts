export interface Language {
  id: string;
  name: string;
  icon: string;
  shikiId: string;
}

export const languages: Language[] = [
  { id: "javascript", name: "JavaScript", icon: "JS", shikiId: "javascript" },
  { id: "typescript", name: "TypeScript", icon: "TS", shikiId: "typescript" },
  { id: "python", name: "Python", icon: "PY", shikiId: "python" },
  { id: "go", name: "Go", icon: "GO", shikiId: "go" },
  { id: "rust", name: "Rust", icon: "RS", shikiId: "rust" },
  { id: "java", name: "Java", icon: "JV", shikiId: "java" },
  { id: "cpp", name: "C++", icon: "C+", shikiId: "cpp" },
  { id: "csharp", name: "C#", icon: "C#", shikiId: "csharp" },
  { id: "ruby", name: "Ruby", icon: "RB", shikiId: "ruby" },
  { id: "php", name: "PHP", icon: "PH", shikiId: "php" },
  { id: "swift", name: "Swift", icon: "SW", shikiId: "swift" },
  { id: "kotlin", name: "Kotlin", icon: "KT", shikiId: "kotlin" },
  { id: "sql", name: "SQL", icon: "SQ", shikiId: "sql" },
  { id: "html", name: "HTML", icon: "HT", shikiId: "html" },
  { id: "css", name: "CSS", icon: "CS", shikiId: "css" },
  { id: "bash", name: "Bash", icon: "SH", shikiId: "bash" },
  { id: "yaml", name: "YAML", icon: "YM", shikiId: "yaml" },
  { id: "json", name: "JSON", icon: "JS", shikiId: "json" },
  { id: "terraform", name: "Terraform", icon: "TF", shikiId: "hcl" },
  { id: "dockerfile", name: "Dockerfile", icon: "DK", shikiId: "dockerfile" },
  { id: "plaintext", name: "Plain Text", icon: "TX", shikiId: "plaintext" },
];

export function getLanguageById(id: string): Language | undefined {
  return languages.find((l) => l.id === id);
}

export function getLanguageByShikiId(shikiId: string): Language | undefined {
  return languages.find((l) => l.shikiId === shikiId);
}
