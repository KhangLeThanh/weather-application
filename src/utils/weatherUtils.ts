import { TemperatureUnit } from "../utils/enum";
import {
  FiSun,
  FiCloud,
  FiCloudRain,
  FiCloudSnow,
  FiWind,
  FiZap,
} from "react-icons/fi";
import type { IconType } from "react-icons";

export interface WeatherInfo {
  label: string;
  icon: IconType;
}

// WMO weather code ranges
export function getWeatherInfo(code: number): WeatherInfo {
  if (code === 0) return { label: "Clear sky", icon: FiSun };
  if (code <= 2) return { label: "Partly cloudy", icon: FiCloud };
  if (code === 3) return { label: "Overcast", icon: FiCloud };
  if (code <= 48) return { label: "Fog", icon: FiWind };
  if (code <= 55) return { label: "Drizzle", icon: FiCloudRain };
  if (code <= 65) return { label: "Rain", icon: FiCloudRain };
  if (code <= 77) return { label: "Snow", icon: FiCloudSnow };
  if (code <= 82) return { label: "Showers", icon: FiCloudRain };
  if (code <= 86) return { label: "Snow showers", icon: FiCloudSnow };
  if (code >= 95) return { label: "Thunderstorm", icon: FiZap };
  return { label: "Unknown", icon: FiCloud };
}

export function getWindDirection(degrees: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8];
}

export function formatTemp(value: number, unit: TemperatureUnit): string {
  return `${Math.round(value)}°${unit === TemperatureUnit.Celsius ? "C" : "F"}`;
}
