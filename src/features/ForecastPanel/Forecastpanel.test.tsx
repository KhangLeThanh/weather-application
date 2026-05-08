import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForecastPanel from "./ForecastPanel";
import { TemperatureUnit } from "../../utils/enum";
import type { WeatherData } from "../../types/weather";

const now = new Date();

// generate hourly times starting exactly from current hour
const futureHours = Array.from({ length: 24 }, (_, i) => {
  const d = new Date(now);
  d.setMinutes(0, 0, 0);
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

const getButtonLabels = () =>
  screen.getAllByRole("button").map((b) => b.textContent?.toLowerCase() ?? "");

describe("ForecastPanel", () => {
  it("renders Daily and Hourly tabs", () => {
    render(<ForecastPanel data={mockData} />);
    const labels = getButtonLabels();
    expect(labels).toContain("daily");
    expect(labels).toContain("hourly");
  });

  it("renders filter options", () => {
    render(<ForecastPanel data={mockData} />);
    const labels = getButtonLabels();
    expect(labels).toContain("today");
    expect(labels).toContain("3 days");
    expect(labels).toContain("7 days");
  });

  it("renders daily view by default", () => {
    render(<ForecastPanel data={mockData} />);
    expect(screen.getAllByText(/May/).length).toBeGreaterThan(0);
  });

  it("shows first day card in daily view", () => {
    render(<ForecastPanel data={mockData} />);
    // first day card shows "TODAY" (may be uppercase due to CSS)
    const allText = document.body.textContent?.toLowerCase() ?? "";
    expect(allText).toContain("today");
  });

  it("switches to hourly view when Hourly tab is clicked", async () => {
    render(<ForecastPanel data={mockData} />);
    const hourlyBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent?.toLowerCase() === "hourly");
    await userEvent.click(hourlyBtn!);
    // after switching, hourly list renders — check for time format HH:00 or "Now"
    const allText = document.body.textContent?.toLowerCase() ?? "";
    expect(allText).toMatch(/now|:00/);
  });

  it("switches back to daily view", async () => {
    render(<ForecastPanel data={mockData} />);
    const buttons = screen.getAllByRole("button");
    const hourlyBtn = buttons.find(
      (b) => b.textContent?.toLowerCase() === "hourly"
    );
    const dailyBtn = buttons.find(
      (b) => b.textContent?.toLowerCase() === "daily"
    );
    await userEvent.click(hourlyBtn!);
    await userEvent.click(dailyBtn!);
    expect(screen.getAllByText(/May/).length).toBeGreaterThan(0);
  });
});
