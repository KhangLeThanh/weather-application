import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWeather } from "../hooks/useWeather";
import * as weatherApi from "../api/weatherApi";
import { TemperatureUnit } from "../utils/enum";
import type { WeatherData } from "../types/weather";

const mockLocation = {
  name: "Helsinki",
  country: "Finland",
  latitude: 60.17,
  longitude: 24.94,
};

const mockWeatherData: WeatherData = {
  location: mockLocation,
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
    uvIndexMax: [],
    windspeedMax: [],
  },
};

describe("useWeather", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with empty state", () => {
    const { result } = renderHook(() => useWeather());
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets loading to true while fetching", async () => {
    vi.spyOn(weatherApi, "fetchWeather").mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.fetch(mockLocation, TemperatureUnit.Celsius);
    });

    expect(result.current.loading).toBe(true);
  });

  it("sets data on successful fetch", async () => {
    vi.spyOn(weatherApi, "fetchWeather").mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetch(mockLocation, TemperatureUnit.Celsius);
    });

    expect(result.current.data).toEqual(mockWeatherData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets error on failed fetch", async () => {
    vi.spyOn(weatherApi, "fetchWeather").mockRejectedValue(
      new Error("Network error")
    );
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetch(mockLocation, TemperatureUnit.Celsius);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Network error");
  });

  it("clears data when clear() is called", async () => {
    vi.spyOn(weatherApi, "fetchWeather").mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetch(mockLocation, TemperatureUnit.Celsius);
    });

    act(() => {
      result.current.clear();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
