import { useState } from "react";
import SearchBar from "./features/SearchBar/SearchBar";
import WeatherDisplay from "./features/WeatherDisplay/WeatherDisplay";
import ForecastPanel from "./features/ForecastPanel/ForecastPanel";
import UnitToggle from "./components/UnitToggle/UnitToggle";
import { TemperatureUnit } from "./utils/enum";
import { useWeather } from "./hooks/useWeather";
import type { Location } from "./types/weather";
import styles from "./App.module.scss";
import "./styles/global.scss";

export default function App() {
  const [unit, setUnit] = useState<TemperatureUnit>(TemperatureUnit.Celsius);
  const { data, loading, error, fetch: fetchWeather } = useWeather();
  const handleSelect = (location: Location) => {
    fetchWeather(location, unit);
  };

  const handleUnitChange = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    if (data) fetchWeather(data.location, newUnit);
  };

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <span className={styles.logo}>Weather Dashboard</span>
        <UnitToggle unit={unit} onChange={handleUnitChange} />
      </header>

      <div className={styles.searchRow}>
        <SearchBar onSelect={handleSelect} />
      </div>

      <main>
        {!data && !loading && !error && (
          <div className={styles.emptyState}>
            <p>Search for a city to see the weather</p>
          </div>
        )}

        {loading && (
          <div className={styles.emptyState}>
            <p>Fetching weather...</p>
          </div>
        )}

        {error && (
          <div className={`${styles.emptyState} ${styles.error}`}>
            <p>Something went wrong: {error}</p>
          </div>
        )}

        {data && !loading && (
          <div className={styles.grid}>
            <WeatherDisplay data={data} />
            <ForecastPanel data={data} />
          </div>
        )}
      </main>
    </div>
  );
}
