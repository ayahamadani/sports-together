import { caloriesPerMinute } from './mockData';

export function estimateCalories(sportType, durationMinutes) {
  const rate = caloriesPerMinute[sportType] || 5;
  return Math.round(rate * Number(durationMinutes));
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 5000 }
    );
  });
}

export async function fetchWeather(lat, lon, date) {
  // open-meteo free API – no key needed
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode&timezone=auto&start_date=${date}&end_date=${date}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  const data = await res.json();

  const temp = data.daily?.temperature_2m_max?.[0];
  const code = data.daily?.weathercode?.[0];

  const codeToDesc = (c) => {
    if (c === 0) return 'Clear sky';
    if (c <= 3) return 'Partly cloudy';
    if (c <= 49) return 'Foggy';
    if (c <= 69) return 'Rainy';
    if (c <= 79) return 'Snowy';
    if (c <= 99) return 'Stormy';
    return 'Unknown';
  };

  return temp != null ? `${Math.round(temp)}°C, ${codeToDesc(code)}` : 'N/A';
}
