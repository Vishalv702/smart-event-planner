export const weatherConfig = {
  API_KEY: process.env.OPENWEATHER_API_KEY || 'ff7df747ea6952246b72b9423174f946',
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  GEO_URL: 'https://api.openweathermap.org/geo/1.0',
  CACHE_DURATION: 3600000, // 1 hour in milliseconds
  FORECAST_LIMIT_DAYS: 5
};
