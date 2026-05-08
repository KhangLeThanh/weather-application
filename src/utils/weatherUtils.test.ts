import { describe, it, expect } from "vitest";
import {
  getWeatherInfo,
  getWindDirection,
  formatTemp,
} from "../utils/weatherUtils";
import { TemperatureUnit } from "../utils/enum";

describe("getWeatherInfo", () => {
  it("returns Clear sky for code 0", () => {
    expect(getWeatherInfo(0).label).toBe("Clear sky");
  });

  it("returns Partly cloudy for code 1 and 2", () => {
    expect(getWeatherInfo(1).label).toBe("Partly cloudy");
    expect(getWeatherInfo(2).label).toBe("Partly cloudy");
  });

  it("returns Rain for codes 61-65", () => {
    expect(getWeatherInfo(61).label).toBe("Rain");
    expect(getWeatherInfo(63).label).toBe("Rain");
    expect(getWeatherInfo(65).label).toBe("Rain");
  });

  it("returns Snow for codes 71-77", () => {
    expect(getWeatherInfo(71).label).toBe("Snow");
    expect(getWeatherInfo(75).label).toBe("Snow");
  });

  it("returns Thunderstorm for code 95+", () => {
    expect(getWeatherInfo(95).label).toBe("Thunderstorm");
    expect(getWeatherInfo(99).label).toBe("Thunderstorm");
  });

  it("returns Unknown for unrecognized code", () => {
    expect(getWeatherInfo(90).label).toBe("Unknown");
  });
});

describe("getWindDirection", () => {
  it("returns N for 0 degrees", () => {
    expect(getWindDirection(0)).toBe("N");
  });

  it("returns E for 90 degrees", () => {
    expect(getWindDirection(90)).toBe("E");
  });

  it("returns S for 180 degrees", () => {
    expect(getWindDirection(180)).toBe("S");
  });

  it("returns W for 270 degrees", () => {
    expect(getWindDirection(270)).toBe("W");
  });

  it("returns NE for 45 degrees", () => {
    expect(getWindDirection(45)).toBe("NE");
  });
});

describe("formatTemp", () => {
  it("formats celsius correctly", () => {
    expect(formatTemp(32, TemperatureUnit.Celsius)).toBe("32°C");
    expect(formatTemp(0, TemperatureUnit.Celsius)).toBe("0°C");
    expect(formatTemp(-5, TemperatureUnit.Celsius)).toBe("-5°C");
  });

  it("formats fahrenheit correctly", () => {
    expect(formatTemp(98, TemperatureUnit.Fahrenheit)).toBe("98°F");
  });

  it("rounds decimal values", () => {
    expect(formatTemp(32.7, TemperatureUnit.Celsius)).toBe("33°C");
    expect(formatTemp(32.2, TemperatureUnit.Celsius)).toBe("32°C");
  });
});
