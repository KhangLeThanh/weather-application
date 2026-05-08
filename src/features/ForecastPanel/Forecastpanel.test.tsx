import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForecastPanel from "./ForecastPanel";
import { TemperatureUnit } from "../../utils/enum";
import type { WeatherData } from "../../types/weather";

const now = new Date();
const futureHours = Array.from({ length: 24 }, (_, i) => {
  const d = new Date(now);
  d.setHours(now.getHours() + i);
  return d.toISOString().slice(0, 16);
});

const mockData: WeatherData = {
  location: {
    name: "Helsinki",
    country: "Finland",
    latitude: 60.17,
    longitude: 24.94,
  },
  unit: TemperatureUnit.Celsius,
  timezone: "Europe/Helsinki",
  current: {
    temperature: 12,
    feelsLike: 9,
    humidity: 60,
    windspeed: 14,
    winddirection: 180,
    weathercode: 1,
    isDay: true,
    time: now.toISOString().slice(0, 16),
  },
  hourly: {
    time: futureHours,
    temperature: Array(24).fill(12),
    weathercode: Array(24).fill(1),
    precipitationProbability: Array(24).fill(10),
    humidity: Array(24).fill(60),
  },
  daily: {
    time: ["2026-05-07", "2026-05-08", "2026-05-09"],
    temperatureMax: [14, 15, 13],
    temperatureMin: [6, 7, 5],
    weathercode: [1, 2, 61],
    precipitationProbabilityMax: [10, 20, 80],
    precipitationSum: [0, 0, 5],
    sunrise: ["2026-05-07T05:00", "2026-05-08T05:00", "2026-05-09T05:00"],
    sunset: ["2026-05-07T21:00", "2026-05-08T21:00", "2026-05-09T21:00"],
    uvIndexMax: [4, 5, 2],
    windspeedMax: [15, 12, 20],
  },
};

describe("ForecastPanel", () => {
  it("renders Daily and Hourly tabs", () => {
    render(<ForecastPanel data={mockData} />);
    expect(screen.getByRole("button", { name: "Daily" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hourly" })).toBeInTheDocument();
  });

  it("renders filter options", () => {
    render(<ForecastPanel data={mockData} />);
    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3 days" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "7 days" })).toBeInTheDocument();
  });

  it("shows Today as first day in daily view", () => {
    render(<ForecastPanel data={mockData} />);
    const todayElements = screen.getAllByText("Today");
    expect(todayElements.length).toBeGreaterThanOrEqual(1);
  });

  it("switches to hourly view when Hourly tab is clicked", async () => {
    render(<ForecastPanel data={mockData} />);
    await userEvent.click(screen.getByRole("button", { name: "Hourly" }));
    expect(screen.getByText("Now")).toBeInTheDocument();
  });

  it("renders daily view by default", () => {
    render(<ForecastPanel data={mockData} />);
    expect(screen.getAllByText(/May/).length).toBeGreaterThan(0);
  });

  it("switches back to daily view", async () => {
    render(<ForecastPanel data={mockData} />);
    await userEvent.click(screen.getByRole("button", { name: "Hourly" }));
    await userEvent.click(screen.getByRole("button", { name: "Daily" }));
    expect(screen.getAllByText(/May/).length).toBeGreaterThan(0);
  });
});
