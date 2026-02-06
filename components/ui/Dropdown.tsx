"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchable = false,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);
  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border border-border bg-bg-code px-3 py-2 text-sm transition-colors",
          "hover:border-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          open && "border-accent"
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selected?.icon}
          <span className={selected ? "text-text-primary" : "text-text-secondary"}>
            {selected?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-text-secondary transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-bg-card shadow-lg shadow-black/30">
          {searchable && (
            <div className="border-b border-border p-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-bg-code rounded px-2 py-1 text-sm text-text-primary outline-none placeholder:text-text-secondary"
                autoFocus
              />
            </div>
          )}
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-text-secondary">No results</div>
          ) : (
            filtered.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                  option.value === value
                    ? "bg-accent/10 text-accent"
                    : "text-text-primary hover:bg-bg-hover"
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
