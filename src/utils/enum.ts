export enum TemperatureUnit {
  Celsius = "celsius",
  Fahrenheit = "fahrenheit",
}

export enum ForecastView {
  Daily = "daily",
  Hourly = "hourly",
}

export enum FilteredDay {
  Today = 1,
  ThreeDays = 3,
  SevenDays = 7,
}

export enum WindSpeedUnit {
  Kmh = "kmh",
  Mph = "mph",
  Ms = "ms",
}

export enum WeatherCode {
  ClearSky = 0,
  MainlyClear = 1,
  PartlyCloudy = 2,
  Overcast = 3,
  Fog = 45,
  IcyFog = 48,
  LightDrizzle = 51,
  Drizzle = 53,
  HeavyDrizzle = 55,
  LightRain = 61,
  Rain = 63,
  HeavyRain = 65,
  LightSnow = 71,
  Snow = 73,
  HeavySnow = 75,
  SnowGrains = 77,
  LightShowers = 80,
  Showers = 81,
  HeavyShowers = 82,
  SnowShowers = 85,
  HeavySnowShowers = 86,
  Thunderstorm = 95,
  ThunderstormWithHail = 96,
  HeavyThunderstorm = 99,
}
