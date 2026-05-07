import { useState } from "react";
import Tab from "../../components/Tab/Tab";
import { getWeatherInfo, formatTemp } from "../../utils/weatherUtils";
import type { WeatherData } from "../../types/weather";
import { ForecastView } from "../../utils/enum";
import styles from "./ForecastPanel.module.scss";

interface ForecastPanelProps {
  data: WeatherData;
}

type TabView = ForecastView.Daily | ForecastView.Hourly;
type DayFilter = 1 | 3 | 7;

const VIEW_OPTIONS = [
  { label: ForecastView.Daily, value: ForecastView.Daily as TabView },
  { label: ForecastView.Hourly, value: ForecastView.Hourly as TabView },
];

const FILTER_OPTIONS = [
  { label: "Today", value: 1 as DayFilter },
  { label: "3 days", value: 3 as DayFilter },
  { label: "7 days", value: 7 as DayFilter },
];

export default function ForecastPanel({ data }: ForecastPanelProps) {
  const [view, setView] = useState<TabView>(ForecastView.Daily);
  const [filter, setFilter] = useState<DayFilter>(7);

  const { daily, hourly, unit } = data;

  const filteredDays = daily.time.slice(0, filter);

  const now = new Date();
  const hoursToShow = filter === 1 ? 24 : filter === 3 ? 72 : 168;
  const filteredHourly = hourly.time
    .map((t, i) => ({ time: t, index: i }))
    .filter(({ time }) => new Date(time) >= now)
    .slice(0, hoursToShow);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Tab
          options={VIEW_OPTIONS}
          value={view}
          onChange={(v) => setView(v as TabView)}
        />
        <Tab
          options={FILTER_OPTIONS}
          value={filter}
          onChange={(v) => setFilter(v as DayFilter)}
        />
      </div>

      {view === ForecastView.Daily && (
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

      {view === ForecastView.Hourly && (
        <div className={styles.hourlyList}>
          {filteredHourly.map(({ time, index }) => {
            const weather = getWeatherInfo(hourly.weathercode[index]);
            const hour = new Date(time).getHours();
            const isNow = new Date(time).getHours() === now.getHours();
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
