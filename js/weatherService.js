const API_KEY = "805ea78ba95c4c44084ee8b539358238";
const ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";

async function fetchJSON(url) {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Weather API error");
  }

  return data;
}

export async function getWeatherByCoords(lat, lon) {
  const url = `${ENDPOINT}?lat=${lat}&lon=${lon}&units=metric&lang=id&appid=${API_KEY}`;
  return fetchJSON(url);
}

export async function getWeatherByCity(city) {
  const url = `${ENDPOINT}?q=${encodeURIComponent(city)}&units=metric&lang=id&appid=${API_KEY}`;
  return fetchJSON(url);
}
