import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tab from "./Tab";

const options = [
  { label: "Daily", value: "daily" },
  { label: "Hourly", value: "hourly" },
];

const getButtonLabels = () =>
  screen.getAllByRole("button").map((b) => b.textContent?.toLowerCase() ?? "");

describe("Tab", () => {
  it("renders all options", () => {
    render(<Tab options={options} value="daily" onChange={vi.fn()} />);
    const labels = getButtonLabels();
    expect(labels).toContain("daily");
    expect(labels).toContain("hourly");
  });

  it("calls onChange with correct value when clicked", async () => {
    const onChange = vi.fn();
    render(<Tab options={options} value="daily" onChange={onChange} />);
    const hourlyBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent?.toLowerCase() === "hourly");
    await userEvent.click(hourlyBtn!);
    expect(onChange).toHaveBeenCalledWith("hourly");
  });

  it("calls onChange only once per click", async () => {
    const onChange = vi.fn();
    render(<Tab options={options} value="daily" onChange={onChange} />);
    const hourlyBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent?.toLowerCase() === "hourly");
    await userEvent.click(hourlyBtn!);
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
    const sevenDaysBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent?.toLowerCase() === "7 days");
    await userEvent.click(sevenDaysBtn!);
    expect(onChange).toHaveBeenCalledWith(7);
  });
});
