import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Slider } from "@/components/ui/Slider";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dropdown } from "@/components/ui/Dropdown";

describe("Slider", () => {
  const steps = ["Lenient", "Medium", "Strict"];

  it("renders all steps", () => {
    render(<Slider value={1} onChange={() => {}} steps={steps} />);
    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it("highlights active step", () => {
    render(<Slider value={1} onChange={() => {}} steps={steps} />);
    expect(screen.getByText("Medium").className).toContain("bg-accent");
  });

  it("calls onChange when step clicked", () => {
    const onChange = vi.fn();
    render(<Slider value={0} onChange={onChange} steps={steps} />);
    fireEvent.click(screen.getByText("Strict"));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});

describe("Checkbox", () => {
  it("renders label", () => {
    render(<Checkbox checked={false} onChange={() => {}} label="Bugs" />);
    expect(screen.getByText("Bugs")).toBeInTheDocument();
  });

  it("shows check icon when checked", () => {
    render(<Checkbox checked onChange={() => {}} label="Bugs" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(checkbox.querySelector("svg")).toBeInTheDocument();
  });

  it("has no check icon when unchecked", () => {
    render(<Checkbox checked={false} onChange={() => {}} label="Bugs" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(checkbox.querySelector("svg")).not.toBeInTheDocument();
  });

  it("calls onChange with toggled value", () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} label="Bugs" />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Dropdown", () => {
  const options = [
    { value: "js", label: "JavaScript" },
    { value: "py", label: "Python" },
    { value: "go", label: "Go" },
  ];

  it("renders selected value", () => {
    render(<Dropdown value="js" onChange={() => {}} options={options} />);
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("renders placeholder when no value", () => {
    render(<Dropdown value="" onChange={() => {}} options={options} placeholder="Choose language" />);
    expect(screen.getByText("Choose language")).toBeInTheDocument();
  });

  it("opens dropdown on click", () => {
    render(<Dropdown value="js" onChange={() => {}} options={options} />);
    fireEvent.click(screen.getByText("JavaScript"));
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
  });

  it("calls onChange on option select", () => {
    const onChange = vi.fn();
    render(<Dropdown value="js" onChange={onChange} options={options} />);
    fireEvent.click(screen.getByText("JavaScript"));
    fireEvent.click(screen.getByText("Python"));
    expect(onChange).toHaveBeenCalledWith("py");
  });

  it("shows search input when searchable", () => {
    render(<Dropdown value="" onChange={() => {}} options={options} searchable />);
    fireEvent.click(screen.getByText("Select..."));
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("filters options when searching", () => {
    render(<Dropdown value="" onChange={() => {}} options={options} searchable />);
    fireEvent.click(screen.getByText("Select..."));
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "py" } });
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.queryByText("JavaScript")).not.toBeInTheDocument();
  });
});
