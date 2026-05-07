import { useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import UnitToggle from "./components/UnitToggle/UnitToggle";
import WeatherDisplay from "./components/WeatherDisplay/WeatherDisplay";
import ForecastPanel from "./components/ForecastPanel/ForecastPanel";
import { useWeather } from "./hooks/useWeather";
import type { Location } from "./types/weather";
import "./styles/global.scss";

export default function App() {
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const { data, loading, error, fetch: fetchWeather } = useWeather();

  const handleSelect = (location: Location) => {
    fetchWeather(location, unit);
  };

  const handleUnitChange = (newUnit: "celsius" | "fahrenheit") => {
    setUnit(newUnit);
    if (data) fetchWeather(data.location, newUnit);
  };

  return (
    <div className="app">
      <header className="topbar">
        <span className="logo">⛅ skye</span>
        <UnitToggle unit={unit} onChange={handleUnitChange} />
      </header>

      <div className="search-row">
        <SearchBar onSelect={handleSelect} />
      </div>

      <main className="content">
        {!data && !loading && !error && (
          <div className="empty-state">
            <p>Search for a city to see the weather 🌍</p>
          </div>
        )}

        {loading && (
          <div className="empty-state">
            <p>Fetching weather...</p>
          </div>
        )}

        {error && (
          <div className="empty-state error">
            <p>Something went wrong: {error}</p>
          </div>
        )}

        {data && !loading && (
          <div className="grid">
            <WeatherDisplay data={data} />
            <ForecastPanel data={data} />
          </div>
        )}
      </main>
    </div>
  );
}
