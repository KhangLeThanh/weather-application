import { TemperatureUnit } from "../utils/enum";

export interface Location {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

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

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  weathercode: number[];
  precipitationProbability: number[];
  humidity: number[];
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecast;
  timezone: string;
  unit: TemperatureUnit.Celsius | TemperatureUnit.Fahrenheit;
}
