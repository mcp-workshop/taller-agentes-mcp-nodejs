export async function getWeatherData(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?daily=precipitation_probability_max,wind_speed_10m_max,uv_index_max,temperature_2m_min,temperature_2m_max,rain_sum&timezone=Europe%2FBerlin&latitude=${latitude}&longitude=${longitude}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'cache-control': 'no-cache' }
  });

  const data = await response.json();
  return data;
}
