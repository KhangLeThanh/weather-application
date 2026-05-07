// Maps WMO weather codes to labels and emoji icons
// https://open-meteo.com/en/docs#weathervariables

export interface WeatherInfo {
  label: string;
  icon: string;
}

const weatherMap: Record<number, WeatherInfo> = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫" },
  48: { label: "Icy fog", icon: "🌫" },
  51: { label: "Light drizzle", icon: "🌦" },
  53: { label: "Drizzle", icon: "🌦" },
  55: { label: "Heavy drizzle", icon: "🌧" },
  61: { label: "Light rain", icon: "🌧" },
  63: { label: "Rain", icon: "🌧" },
  65: { label: "Heavy rain", icon: "🌧" },
  71: { label: "Light snow", icon: "🌨" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "🌨" },
  80: { label: "Light showers", icon: "🌦" },
  81: { label: "Showers", icon: "🌧" },
  82: { label: "Heavy showers", icon: "⛈" },
  85: { label: "Snow showers", icon: "🌨" },
  86: { label: "Heavy snow showers", icon: "❄️" },
  95: { label: "Thunderstorm", icon: "⛈" },
  96: { label: "Thunderstorm w/ hail", icon: "⛈" },
  99: { label: "Heavy thunderstorm", icon: "⛈" },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return weatherMap[code] ?? { label: "Unknown", icon: "🌡" };
}

export function getUVLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "Low", color: "#4CAF50" };
  if (uv <= 5) return { label: "Moderate", color: "#FFEB3B" };
  if (uv <= 7) return { label: "High", color: "#FF9800" };
  if (uv <= 10) return { label: "Very High", color: "#F44336" };
  return { label: "Extreme", color: "#9C27B0" };
}

export function getWindDirection(degrees: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8];
}

export function formatTemp(
  value: number,
  unit: "celsius" | "fahrenheit"
): string {
  return `${Math.round(value)}°${unit === "celsius" ? "C" : "F"}`;
}
