import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WeatherDisplay from "./WeatherDisplay";
import { TemperatureUnit } from "../../utils/enum";
import type { WeatherData } from "../../types/weather";

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
    time: "2026-05-07T12:00",
  },
  hourly: {
    time: [],
    temperature: [],
    weathercode: [],
    precipitationProbability: [],
    humidity: [],
  },
  daily: {
    time: [],
    temperatureMax: [],
    temperatureMin: [],
    weathercode: [],
    precipitationProbabilityMax: [],
    precipitationSum: [],
    sunrise: [],
    sunset: [],
    uvIndexMax: [5],
    windspeedMax: [],
  },
};

describe("WeatherDisplay", () => {
  it("renders city name and country", () => {
    render(<WeatherDisplay data={mockData} />);
    expect(screen.getByText("Helsinki")).toBeInTheDocument();
    expect(screen.getByText(/Finland/)).toBeInTheDocument();
  });

  it("renders temperature", () => {
    render(<WeatherDisplay data={mockData} />);
    expect(screen.getByText("12°C")).toBeInTheDocument();
  });

  it("renders feels like", () => {
    render(<WeatherDisplay data={mockData} />);
    expect(screen.getByText("9°C")).toBeInTheDocument();
  });

  it("renders humidity", () => {
    render(<WeatherDisplay data={mockData} />);
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("renders wind info", () => {
    render(<WeatherDisplay data={mockData} />);
    expect(screen.getByText(/14 km\/h/)).toBeInTheDocument();
  });

  it("shows Daytime when isDay is true", () => {
    render(<WeatherDisplay data={mockData} />);
    expect(screen.getByText(/Daytime/)).toBeInTheDocument();
  });

  it("shows Nighttime when isDay is false", () => {
    render(
      <WeatherDisplay
        data={{ ...mockData, current: { ...mockData.current, isDay: false } }}
      />
    );
    expect(screen.getByText(/Nighttime/)).toBeInTheDocument();
  });

  it("renders in fahrenheit", () => {
    const fahrenheitData = {
      ...mockData,
      unit: TemperatureUnit.Fahrenheit,
      current: { ...mockData.current, temperature: 54 },
    };
    render(<WeatherDisplay data={fahrenheitData} />);
    expect(screen.getByText("54°F")).toBeInTheDocument();
  });
});
