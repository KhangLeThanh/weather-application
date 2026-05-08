import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tab from "./Tab";

const options = [
  { label: "Daily", value: "daily" },
  { label: "Hourly", value: "hourly" },
];

describe("Tab", () => {
  it("renders all options", () => {
    render(<Tab options={options} value="daily" onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Daily" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hourly" })).toBeInTheDocument();
  });

  it("calls onChange with correct value when clicked", async () => {
    const onChange = vi.fn();
    render(<Tab options={options} value="daily" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Hourly" }));
    expect(onChange).toHaveBeenCalledWith("hourly");
  });

  it("calls onChange only once per click", async () => {
    const onChange = vi.fn();
    render(<Tab options={options} value="daily" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Hourly" }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("works with number values", async () => {
    const numOptions = [
      { label: "Today", value: 1 },
      { label: "3 days", value: 3 },
      { label: "7 days", value: 7 },
    ];
    const onChange = vi.fn();
    render(<Tab options={numOptions} value={1} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "7 days" }));
    expect(onChange).toHaveBeenCalledWith(7);
  });
});
