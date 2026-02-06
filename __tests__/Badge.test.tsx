import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryBadge, SeverityBadge } from "@/components/ui/Badge";

describe("CategoryBadge", () => {
  it("renders bug badge", () => {
    render(<CategoryBadge category="bug" />);
    expect(screen.getByText("BUG")).toBeInTheDocument();
  });

  it("renders security badge", () => {
    render(<CategoryBadge category="security" />);
    expect(screen.getByText("SEC")).toBeInTheDocument();
  });

  it("renders performance badge", () => {
    render(<CategoryBadge category="performance" />);
    expect(screen.getByText("PERF")).toBeInTheDocument();
  });

  it("renders style badge", () => {
    render(<CategoryBadge category="style" />);
    expect(screen.getByText("STYLE")).toBeInTheDocument();
  });

  it("includes icon", () => {
    render(<CategoryBadge category="bug" />);
    const badge = screen.getByText("BUG").closest("span");
    const svg = badge?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies correct color class for bug", () => {
    render(<CategoryBadge category="bug" />);
    const badge = screen.getByText("BUG").closest("span");
    expect(badge?.className).toContain("text-bug");
  });
});

describe("SeverityBadge", () => {
  it("renders critical badge", () => {
    render(<SeverityBadge severity="critical" />);
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
  });

  it("renders warning badge", () => {
    render(<SeverityBadge severity="warning" />);
    expect(screen.getByText("WARNING")).toBeInTheDocument();
  });

  it("renders info badge", () => {
    render(<SeverityBadge severity="info" />);
    expect(screen.getByText("INFO")).toBeInTheDocument();
  });

  it("renders praise badge", () => {
    render(<SeverityBadge severity="praise" />);
    expect(screen.getByText("PRAISE")).toBeInTheDocument();
  });

  it("applies correct color class for critical", () => {
    render(<SeverityBadge severity="critical" />);
    const badge = screen.getByText("CRITICAL").closest("span");
    expect(badge?.className).toContain("text-bug");
  });

  it("applies correct color class for praise", () => {
    render(<SeverityBadge severity="praise" />);
    const badge = screen.getByText("PRAISE").closest("span");
    expect(badge?.className).toContain("text-praise");
  });
});
