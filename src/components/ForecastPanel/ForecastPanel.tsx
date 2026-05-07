import { useState } from "react";
import { getWeatherInfo, formatTemp } from "../../utils/weatherUtils";
import type { WeatherData } from "../../types/weather";
import FilterBar, { type ForecastFilter } from "../FilterBar/FilterBar";
import styles from "./ForecastPanel.module.scss";

interface ForecastPanelProps {
  data: WeatherData;
}

type Tab = "daily" | "hourly";

export default function ForecastPanel({ data }: ForecastPanelProps) {
  const [tab, setTab] = useState<Tab>("daily");
  const [filter, setFilter] = useState<ForecastFilter>(7);

  const { daily, hourly, unit } = data;

  // Filter daily forecast by number of days
  const filteredDays = daily.time.slice(0, filter);

  // Filter hourly to next N hours based on current time
  const now = new Date();
  const currentHour = now.getHours();
  const hoursToShow = filter === 1 ? 24 : filter === 3 ? 72 : 168;
  const filteredHourly = hourly.time
    .map((t, i) => ({ time: t, index: i }))
    .filter(({ time }) => new Date(time) >= now)
    .slice(0, hoursToShow);

  return (
    <div className={styles.panel}>
      {/* Tabs */}
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "daily" ? styles.active : ""}`}
            onClick={() => setTab("daily")}
          >
            Daily
          </button>
          <button
            className={`${styles.tab} ${tab === "hourly" ? styles.active : ""}`}
            onClick={() => setTab("hourly")}
          >
            Hourly
          </button>
        </div>
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      {/* Daily view */}
      {tab === "daily" && (
        <div className={styles.dailyGrid}>
          {filteredDays.map((day, i) => {
            const weather = getWeatherInfo(daily.weathercode[i]);
            return (
              <div
                key={day}
                className={`${styles.dayCard} ${i === 0 ? styles.today : ""}`}
              >
                <div className={styles.dayName}>
                  {i === 0
                    ? "Today"
                    : new Date(day).toLocaleDateString("en", {
                        weekday: "short",
                      })}
                </div>
                <div className={styles.dayDate}>
                  {new Date(day).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className={styles.dayIcon}>{weather.icon}</div>
                <div className={styles.dayCondition}>{weather.label}</div>
                <div className={styles.dayTemps}>
                  <span className={styles.tempHi}>
                    {formatTemp(daily.temperatureMax[i], unit)}
                  </span>
                  <span className={styles.tempLo}>
                    {formatTemp(daily.temperatureMin[i], unit)}
                  </span>
                </div>
                <div className={styles.dayRain}>
                  🌧 {daily.precipitationProbabilityMax[i]}%
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hourly view */}
      {tab === "hourly" && (
        <div className={styles.hourlyList}>
          {filteredHourly.map(({ time, index }) => {
            const weather = getWeatherInfo(hourly.weathercode[index]);
            const hour = new Date(time).getHours();
            const isNow = new Date(time).getHours() === currentHour;
            return (
              <div
                key={time}
                className={`${styles.hourRow} ${isNow ? styles.nowRow : ""}`}
              >
                <span className={styles.hourTime}>
                  {isNow ? "Now" : `${String(hour).padStart(2, "0")}:00`}
                </span>
                <span className={styles.hourIcon}>{weather.icon}</span>
                <span className={styles.hourCondition}>{weather.label}</span>
                <span className={styles.hourRain}>
                  🌧 {hourly.precipitationProbability[index]}%
                </span>
                <span className={styles.hourHumidity}>
                  💧 {hourly.humidity[index]}%
                </span>
                <span className={styles.hourTemp}>
                  {formatTemp(hourly.temperature[index], unit)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
