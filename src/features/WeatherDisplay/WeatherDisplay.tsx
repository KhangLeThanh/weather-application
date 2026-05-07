import {
  getWeatherInfo,
  getWindDirection,
  formatTemp,
} from "../../utils/weatherUtils";
import type { WeatherData } from "../../types/weather";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "./WeatherDisplay.module.scss";

interface WeatherDisplayProps {
  data: WeatherData;
}

export default function WeatherDisplay({ data }: WeatherDisplayProps) {
  const { current, location, daily, unit } = data;
  const weather = getWeatherInfo(current.weathercode);

  const stats = [
    { label: "Feels like", value: formatTemp(current.feelsLike, unit) },
    { label: "Humidity", value: `${current.humidity}%` },
    {
      label: "Wind",
      value: `${Math.round(current.windspeed)} km/h ${getWindDirection(
        current.winddirection
      )}`,
    },
    { label: "UV Index", value: String(daily.uvIndexMax[0]) },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.location}>
        <h2 className={styles.city}>{location.name}</h2>
        <p className={styles.country}>
          {location.country} &middot; {data.timezone}
        </p>
      </div>

      <div className={styles.main}>
        <span className={styles.icon}>{weather.icon}</span>
        <div>
          <div className={styles.temp}>
            {formatTemp(current.temperature, unit)}
          </div>
          <div className={styles.condition}>{weather.label}</div>
          <div className={styles.daynight}>
            {current.isDay ? (
              <>
                <FiSun /> Daytime
              </>
            ) : (
              <>
                <FiMoon /> Nighttime
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
