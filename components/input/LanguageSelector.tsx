"use client";

import { Dropdown } from "@/components/ui/Dropdown";
import { languages } from "@/data/languages";
import { cn } from "@/lib/cn";

export interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const languageOptions = [
  { value: "auto", label: "Auto-detect" },
  ...languages.map((lang) => ({
    value: lang.id,
    label: lang.name,
    icon: (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold bg-bg-hover text-text-secondary">
        {lang.icon}
      </span>
    ),
  })),
];

export function LanguageSelector({ value, onChange, className }: LanguageSelectorProps) {
  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={languageOptions}
      searchable
      className={cn("w-48", className)}
    />
  );
}
