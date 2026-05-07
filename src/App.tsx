import { useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import { useWeather } from "./hooks/useWeather";
import {
  getWeatherInfo,
  getWindDirection,
  formatTemp,
} from "./utils/weatherUtils";
import type { Location } from "./types/weather";
import "./styles/global.scss";

export default function App() {
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const { data, loading, error, fetch: fetchWeather } = useWeather();

  const handleSelect = (location: Location) => {
    console.log("test location", location);
    fetchWeather(location, unit);
  };

  const toggleUnit = () => {
    const next = unit === "celsius" ? "fahrenheit" : "celsius";
    setUnit(next);
    if (data) fetchWeather(data.location, next);
  };
  console.log("test data", data);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0f1a",
        color: "#e8eaf6",
        padding: "32px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <h1
        style={{
          fontFamily: "'Space Mono', monospace",
          color: "#7eb3ff",
          marginBottom: 24,
        }}
      >
        ⛅ skye
      </h1>

      {/* Search + unit toggle */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <SearchBar onSelect={handleSelect} />
        <button
          onClick={toggleUnit}
          style={{
            background: "#1a1d2e",
            border: "1.5px solid #2e3250",
            borderRadius: 8,
            color: "#e8eaf6",
            padding: "10px 18px",
            cursor: "pointer",
            fontFamily: "'Space Mono', monospace",
            fontSize: 14,
            whiteSpace: "nowrap",
          }}
        >
          Switch to °{unit === "celsius" ? "F" : "C"}
        </button>
      </div>

      {/* States */}
      {loading && <p style={{ color: "#7b82a8" }}>Fetching weather...</p>}

      {error && <p style={{ color: "#f56b6b" }}>Error: {error}</p>}

      {/* Weather output — raw data for testing */}
      {data && !loading && (
        <div style={{ display: "grid", gap: 16, maxWidth: 700 }}>
          {/* Current */}
          <div
            style={{
              background: "#1a1d2e",
              border: "1px solid #2e3250",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <p
              style={{
                color: "#7b82a8",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 12px",
              }}
            >
              Current
            </p>
            <h2 style={{ margin: "0 0 4px", fontSize: 28 }}>
              {data.location.name}, {data.location.country}
            </h2>
            <p style={{ color: "#7b82a8", margin: "0 0 20px", fontSize: 13 }}>
              {data.location.latitude}°N, {data.location.longitude}°E ·{" "}
              {data.timezone}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 56 }}>
                {getWeatherInfo(data.current.weathercode).icon}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 56,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "#fff",
                  }}
                >
                  {formatTemp(data.current.temperature, unit)}
                </div>
                <div style={{ color: "#a0a8cc", marginTop: 4 }}>
                  {getWeatherInfo(data.current.weathercode).label}
                </div>
                <div style={{ color: "#7b82a8", fontSize: 13 }}>
                  Feels like {formatTemp(data.current.feelsLike, unit)}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {[
                { label: "Humidity", value: `${data.current.humidity}%` },
                {
                  label: "Wind",
                  value: `${Math.round(
                    data.current.windspeed
                  )} km/h ${getWindDirection(data.current.winddirection)}`,
                },
                { label: "UV Index", value: data.daily.uvIndexMax[0] },
                {
                  label: "Day/Night",
                  value: data.current.isDay ? "Day ☀️" : "Night 🌙",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "#151827",
                    borderRadius: 10,
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#7b82a8",
                      marginTop: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-day */}
          <div
            style={{
              background: "#1a1d2e",
              border: "1px solid #2e3250",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <p
              style={{
                color: "#7b82a8",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 16px",
              }}
            >
              7-day forecast
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 8,
              }}
            >
              {data.daily.time.map((day, i) => (
                <div
                  key={day}
                  style={{
                    background: i === 0 ? "#1a2040" : "#151827",
                    border: `1px solid ${i === 0 ? "#5b8af5" : "#2e3250"}`,
                    borderRadius: 12,
                    padding: "12px 8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#7b82a8",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {i === 0
                      ? "Today"
                      : new Date(day).toLocaleDateString("en", {
                          weekday: "short",
                        })}
                  </div>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>
                    {getWeatherInfo(data.daily.weathercode[i]).icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {formatTemp(data.daily.temperatureMax[i], unit)}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      color: "#7b82a8",
                      marginTop: 2,
                    }}
                  >
                    {formatTemp(data.daily.temperatureMin[i], unit)}
                  </div>
                  <div style={{ fontSize: 10, color: "#5b8af5", marginTop: 6 }}>
                    {data.daily.precipitationProbabilityMax[i]}% 🌧
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sunrise / Sunset */}
          <div
            style={{
              background: "#1a1d2e",
              border: "1px solid #2e3250",
              borderRadius: 16,
              padding: 24,
              display: "flex",
              gap: 32,
            }}
          >
            <div>
              <p
                style={{
                  color: "#7b82a8",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: "0 0 8px",
                }}
              >
                Sunrise
              </p>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: "#f5a623",
                }}
              >
                {new Date(data.daily.sunrise[0]).toLocaleTimeString("en", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#7b82a8",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: "0 0 8px",
                }}
              >
                Sunset
              </p>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: "#f5a623",
                }}
              >
                {new Date(data.daily.sunset[0]).toLocaleTimeString("en", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
