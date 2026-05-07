import axios from "axios";
import type { Location, WeatherData } from "../types/weather";
import { TemperatureUnit, WindSpeedUnit } from "../utils/enum";

// api for getting lat and long
const geoClient = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
});

// api for getting weather
const weatherClient = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
});

// fetching lat, long, country, name
export async function searchLocations(query: string): Promise<Location[]> {
  if (!query.trim()) return [];

  const { data } = await geoClient.get("/search", {
    params: {
      name: query,
      count: 6,
      language: "en",
      format: "json",
    },
  });

  if (!data.results) return [];

  return data.results.map((r: any) => ({
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

// fetching weather for a location
export async function fetchWeather(
  location: Location,
  unit:
    | TemperatureUnit.Celsius
    | TemperatureUnit.Fahrenheit = TemperatureUnit.Celsius
): Promise<WeatherData> {
  const { data } = await weatherClient.get("/forecast", {
    params: {
      latitude: location.latitude,
      longitude: location.longitude,
      current: [
        "temperature_2m",
        "apparent_temperature",
        "relative_humidity_2m",
        "windspeed_10m",
        "winddirection_10m",
        "weathercode",
        "is_day",
      ].join(","),
      hourly: [
        "temperature_2m",
        "weathercode",
        "precipitation_probability",
        "relative_humidity_2m",
      ].join(","),
      daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "weathercode",
        "precipitation_probability_max",
        "precipitation_sum",
        "sunrise",
        "sunset",
        "uv_index_max",
        "windspeed_10m_max",
      ].join(","),
      temperature_unit: unit,
      wind_speed_unit: WindSpeedUnit.Kmh,
      timezone: "auto",
      forecast_days: 7,
    },
  });

  return {
    location,
    unit,
    timezone: data.timezone,
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windspeed: data.current.windspeed_10m,
      winddirection: data.current.winddirection_10m,
      weathercode: data.current.weathercode,
      isDay: data.current.is_day === 1,
      time: data.current.time,
    },
    hourly: {
      time: data.hourly.time,
      temperature: data.hourly.temperature_2m,
      weathercode: data.hourly.weathercode,
      precipitationProbability: data.hourly.precipitation_probability,
      humidity: data.hourly.relative_humidity_2m,
    },
    daily: {
      time: data.daily.time,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
      weathercode: data.daily.weathercode,
      precipitationProbabilityMax: data.daily.precipitation_probability_max,
      precipitationSum: data.daily.precipitation_sum,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
      uvIndexMax: data.daily.uv_index_max,
      windspeedMax: data.daily.windspeed_10m_max,
    },
  };
}
