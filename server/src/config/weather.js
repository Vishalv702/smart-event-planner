export const weatherConfig = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  GEO_URL: 'https://api.openweathermap.org/geo/1.0',
  DB_CACHE_DURATION: 3600000, // 1 hour in milliseconds
  MEMORY_CACHE_DURATION: 1800000, // 30 minutes in milliseconds
  MAX_MEMORY_CACHE_ENTRIES: 1000,
  FORECAST_LIMIT_DAYS: 5
};
