import { useState } from "react";
import Tab from "../../components/Tab/Tab";
import { getWeatherInfo, formatTemp } from "../../utils/weatherUtils";
import { FiCloudRain, FiDroplet } from "react-icons/fi";
import type { WeatherData } from "../../types/weather";
import { ForecastView, FilteredDay } from "../../utils/enum";
import styles from "./ForecastPanel.module.scss";

interface ForecastPanelProps {
  data: WeatherData;
}
type DayFilter =
  | FilteredDay.Today
  | FilteredDay.ThreeDays
  | FilteredDay.SevenDays;
const VIEW_OPTIONS: { label: string; value: ForecastView }[] = [
  { label: "Daily", value: ForecastView.Daily },
  { label: "Hourly", value: ForecastView.Hourly },
];

const FILTER_OPTIONS: { label: string; value: DayFilter }[] = [
  { label: "Today", value: FilteredDay.Today },
  { label: "3 days", value: FilteredDay.ThreeDays },
  { label: "7 days", value: FilteredDay.SevenDays },
];

const HOURS_MAP: Record<DayFilter, number> = {
  [FilteredDay.Today]: 24,
  [FilteredDay.ThreeDays]: 72,
  [FilteredDay.SevenDays]: 168,
};

export default function ForecastPanel({ data }: ForecastPanelProps) {
  const [view, setView] = useState<ForecastView>(ForecastView.Daily);
  const [filter, setFilter] = useState<DayFilter>(FilteredDay.SevenDays);

  const { daily, hourly, unit } = data;
  const filteredDays = daily.time.slice(0, filter);
  const now = new Date();

  const filteredHourly = hourly.time
    .map((t, i) => ({ time: t, index: i }))
    .filter(({ time }) => new Date(time) >= now)
    .slice(0, HOURS_MAP[filter]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Tab<ForecastView>
          options={VIEW_OPTIONS}
          value={view}
          onChange={setView}
        />
        <Tab<DayFilter>
          options={FILTER_OPTIONS}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {view === ForecastView.Daily && (
        <div className={styles.dailyGrid}>
          {filteredDays.map((day, i) => {
            const { label, icon: WeatherIcon } = getWeatherInfo(
              daily.weathercode[i]
            );
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
                <div className={styles.dayIcon}>
                  <WeatherIcon size={30} />
                </div>
                <div className={styles.dayCondition}>{label}</div>
                <div className={styles.dayTemps}>
                  <span className={styles.tempHi}>
                    {formatTemp(daily.temperatureMax[i], unit)}
                  </span>
                  <span className={styles.tempLo}>
                    {formatTemp(daily.temperatureMin[i], unit)}
                  </span>
                </div>
                <div className={styles.dayRain}>
                  <FiCloudRain /> {daily.precipitationProbabilityMax[i]}%
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === ForecastView.Hourly && (
        <div className={styles.hourlyList}>
          {filteredHourly.map(({ time, index }) => {
            const { label, icon: WeatherIcon } = getWeatherInfo(
              hourly.weathercode[index]
            );
            const hour = new Date(time).getHours();
            const isNow = hour === now.getHours();
            return (
              <div
                key={time}
                className={`${styles.hourRow} ${isNow ? styles.nowRow : ""}`}
              >
                <span className={styles.hourTime}>
                  {isNow ? "Now" : `${String(hour).padStart(2, "0")}:00`}
                </span>
                <span className={styles.hourIcon}>
                  <WeatherIcon size={20} />
                </span>
                <span className={styles.hourCondition}>{label}</span>
                <span className={styles.hourRain}>
                  <FiCloudRain /> {hourly.precipitationProbability[index]}%
                </span>
                <span className={styles.hourHumidity}>
                  <FiDroplet /> {hourly.humidity[index]}%
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
