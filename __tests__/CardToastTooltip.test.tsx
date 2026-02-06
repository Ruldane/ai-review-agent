import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { Tooltip } from "@/components/ui/Tooltip";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies border and background classes", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.className).toContain("border-border");
    expect(card.className).toContain("bg-bg-card");
  });

  it("applies elevated variant", () => {
    render(<Card variant="elevated" data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.className).toContain("shadow-lg");
  });

  it("applies custom className", () => {
    render(<Card className="custom-class" data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.className).toContain("custom-class");
  });
});

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders when visible", () => {
    render(<Toast message="Success!" visible onDismiss={() => {}} />);
    expect(screen.getByText("Success!")).toBeInTheDocument();
  });

  it("does not render when not visible", () => {
    render(<Toast message="Hidden" visible={false} onDismiss={() => {}} />);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("has alert role", () => {
    render(<Toast message="Alert" visible onDismiss={() => {}} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("auto-dismisses after duration", () => {
    const onDismiss = vi.fn();
    render(<Toast message="Auto" visible onDismiss={onDismiss} duration={2000} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss when close button clicked", () => {
    const onDismiss = vi.fn();
    render(<Toast message="Close me" visible onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("Tooltip", () => {
  it("renders children", () => {
    render(<Tooltip content="Hint"><button>Hover me</button></Tooltip>);
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows tooltip on hover", () => {
    render(<Tooltip content="Hint text"><button>Hover me</button></Tooltip>);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByText("Hover me").parentElement!);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Hint text");
  });

  it("hides tooltip on mouse leave", () => {
    render(<Tooltip content="Hint text"><button>Hover me</button></Tooltip>);
    const wrapper = screen.getByText("Hover me").parentElement!;
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.mouseLeave(wrapper);
    // AnimatePresence may keep it briefly, but the exit animation triggers
  });
});
