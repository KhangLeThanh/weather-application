// ── Location ──────────────────────────────────────────────
export interface Location {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

// ── Current Weather ───────────────────────────────────────
export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  isDay: boolean;
  time: string;
}

// ── Daily Forecast ────────────────────────────────────────
export interface DailyForecast {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  weathercode: number[];
  precipitationProbabilityMax: number[];
  precipitationSum: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
  windspeedMax: number[];
}

// ── Hourly Forecast ───────────────────────────────────────
export interface HourlyForecast {
  time: string[];
  temperature: number[];
  weathercode: number[];
  precipitationProbability: number[];
  humidity: number[];
}

// ── Full Weather Response ─────────────────────────────────
export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecast;
  timezone: string;
  unit: "celsius" | "fahrenheit";
}
