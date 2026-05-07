import type { Location } from "../types/weather";

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<Location> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
    { headers: { "User-Agent": "weather-app" } }
  );
  const data = await res.json();

  const name =
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.county ||
    "Unknown";

  return {
    name,
    country: data.address?.country || "",
    latitude: lat,
    longitude: lon,
  };
}
