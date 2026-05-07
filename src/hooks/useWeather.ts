import { useState, useCallback } from "react";
import { fetchWeather } from "../api/weatherApi";
import { TemperatureUnit } from "../utils/enum";
import type { Location, WeatherData } from "../types/weather";

interface UseWeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

interface UseWeatherReturn extends UseWeatherState {
  fetch: (
    location: Location,
    unit?: TemperatureUnit.Celsius | TemperatureUnit.Fahrenheit
  ) => Promise<void>;
  clear: () => void;
}

export function useWeather(): UseWeatherReturn {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(
    async (
      location: Location,
      unit:
        | TemperatureUnit.Celsius
        | TemperatureUnit.Fahrenheit = TemperatureUnit.Celsius
    ) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await fetchWeather(location, unit);
        setState({ data, loading: false, error: null });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch weather data.";
        setState({
          data: null,
          loading: false,
          error: message,
        });
      }
    },
    []
  );

  const clear = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, fetch, clear };
}
