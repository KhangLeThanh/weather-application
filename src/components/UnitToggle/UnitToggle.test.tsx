import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UnitToggle from "./UnitToggle";
import { TemperatureUnit } from "../../utils/enum";

describe("UnitToggle", () => {
  it("renders both buttons", () => {
    render(<UnitToggle unit={TemperatureUnit.Celsius} onChange={vi.fn()} />);
    expect(screen.getByText("°C")).toBeInTheDocument();
    expect(screen.getByText("°F")).toBeInTheDocument();
  });

  it("calls onChange with Fahrenheit when °F is clicked", async () => {
    const onChange = vi.fn();
    render(<UnitToggle unit={TemperatureUnit.Celsius} onChange={onChange} />);
    await userEvent.click(screen.getByText("°F"));
    expect(onChange).toHaveBeenCalledWith(TemperatureUnit.Fahrenheit);
  });

  it("calls onChange with Celsius when °C is clicked", async () => {
    const onChange = vi.fn();
    render(
      <UnitToggle unit={TemperatureUnit.Fahrenheit} onChange={onChange} />
    );
    await userEvent.click(screen.getByText("°C"));
    expect(onChange).toHaveBeenCalledWith(TemperatureUnit.Celsius);
  });

  it("calls onChange only once per click", async () => {
    const onChange = vi.fn();
    render(<UnitToggle unit={TemperatureUnit.Celsius} onChange={onChange} />);
    await userEvent.click(screen.getByText("°F"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
