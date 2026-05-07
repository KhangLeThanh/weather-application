import axios from "axios";
import type { Location } from "../types/weather";

const nominatimClient = axios.create({
  baseURL: "https://nominatim.openstreetmap.org",
  headers: { "User-Agent": "weather-app" },
});

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<Location> {
  const { data } = await nominatimClient.get("/reverse", {
    params: {
      lat,
      lon,
      format: "json",
      "accept-language": "en",
    },
  });

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
