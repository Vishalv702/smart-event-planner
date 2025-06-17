import axios from 'axios';
import {weatherConfig} from '../config/weather.js';
import { Weather } from '../models/index.js';
import { normalizeLocation } from '../utils/helpers.js';

class WeatherService {
  async getCoordinates(location) {
    try {
      const response = await axios.get(
        `${weatherConfig.GEO_URL}/direct?q=${encodeURIComponent(location)}&limit=1&appid=${weatherConfig.API_KEY}`
      );

      if (response.data && response.data.length > 0) {
        return {
          lat: response.data[0].lat,
          lon: response.data[0].lon,
          name: response.data[0].name,
          country: response.data[0].country
        };
      }
      throw new Error('Location not found');
    } catch (error) {
      throw new Error(`Failed to get coordinates: ${error.message}`);
    }
  }

  async fetchWeatherData(location, date) {
    try {
      const normalizedLocation = normalizeLocation(location);

      const cachedWeather = await this.getCachedWeather(normalizedLocation, date);
      if (cachedWeather) {
        console.log(`📋 Using cached weather data for ${location} on ${date}`);
        return cachedWeather.toObject();
      }

      console.log(`🌤️  Fetching fresh weather data for ${location} on ${date}`);

      const coords = await this.getCoordinates(location);
      const weatherData = await this.getWeatherByDate(coords, date);

      const normalizedData = this.normalizeWeatherData(
        location, normalizedLocation, date, coords, weatherData.data, weatherData.fullResponse
      );

      const savedWeather = await Weather.findOneAndUpdate(
        { normalized_location: normalizedLocation, date: date },
        normalizedData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return {...savedWeather.toObject(),
        fullList:weatherData.fullList
      };
    } catch (error) {
      throw new Error(`Weather fetch failed: ${error.message}`);
    }
  }

  async getCachedWeather(normalizedLocation, date) {
    return await Weather.findOne({
      normalized_location: normalizedLocation,
      date: date,
      created_at: { $gte: new Date(Date.now() - weatherConfig.CACHE_DURATION) }
    });
  }

  async getWeatherByDate(coords, date) {
  const targetDate = new Date(date);
  const now = new Date();
  const daysDiff = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 0) {
    const response = await axios.get(
      `${weatherConfig.BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${weatherConfig.API_KEY}&units=metric`
    );
    return {
      data: response.data,
      fullResponse: response.data,
      fullList: null  // No forecast list for current/historical data
    };
  } else if (daysDiff <= weatherConfig.FORECAST_LIMIT_DAYS) {
    const response = await axios.get(
      `${weatherConfig.BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${weatherConfig.API_KEY}&units=metric`
    );

    const closestForecast = this.findClosestForecast(response.data.list, targetDate);

    return {
      data: {
        main: closestForecast.main,
        weather: closestForecast.weather,
        wind: closestForecast.wind,
        visibility: closestForecast.visibility || 10000,
        rain: closestForecast.rain,
        snow: closestForecast.snow
      },
      fullResponse: {
        forecast: closestForecast,
        full_response: response.data
      },
      fullList: response.data.list // ✅ Needed for trend analysis
    };
  } else {
    throw new Error('Weather forecast only available for next 5 days');
  }
}

  async getHistoricalWeather(lat, lon, pastDate) {
    const timestamp = Math.floor(new Date(pastDate).getTime() / 1000); // convert to UNIX time

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall/timemachine`,
        {
          params: {
            lat,
            lon,
            dt: timestamp,
            appid: weatherConfig.API_KEY,
            units: 'metric'
          }
        }
      );

      return {
        date: pastDate,
        temp: response.data.current.temp,
        condition: response.data.current.weather[0].description
      };
    } catch (error) {
      throw new Error(`Failed to fetch historical weather: ${error.message}`);
    }
  }
async getHourlyForecast(lat, lon, date) {
  const response = await axios.get(
    `${weatherConfig.BASE_URL}/forecast`,
    {
      params: {
        lat,
        lon,
        appid: weatherConfig.API_KEY,
        units: 'metric'
      }
    }
  );

  const targetDate = new Date(date).toISOString().split('T')[0];

  const hourlyForecast = response.data.list
    .filter(entry => entry.dt_txt.startsWith(targetDate))
    .map(entry => ({
      time: entry.dt_txt,
      temperature: entry.main.temp,
      feels_like: entry.main.feels_like,
      weather: entry.weather[0].description,
      wind_speed: entry.wind.speed,
      precipitation: (entry.rain?.['3h'] || entry.snow?.['3h'] || 0)
    }));

  return hourlyForecast;
}

  findClosestForecast(forecastList, targetDate) {
    const targetTimestamp = targetDate.getTime();
    let closestForecast = forecastList[0];
    let minDiff = Math.abs(new Date(closestForecast.dt * 1000) - targetTimestamp);

    forecastList.forEach(forecast => {
      const diff = Math.abs(new Date(forecast.dt * 1000) - targetTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closestForecast = forecast;
      }
    });

    return closestForecast;
  }

  normalizeWeatherData(location, normalizedLocation, date, coords, weatherData, fullResponse) {
    return {
      location: location,
      normalized_location: normalizedLocation,
      date: date,
      coordinates: coords,
      temperature: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      weather_main: weatherData.weather[0].main,
      weather_description: weatherData.weather[0].description,
      wind_speed: weatherData.wind.speed,
      wind_direction: weatherData.wind.deg || 0,
      precipitation: (weatherData.rain?.['3h'] || weatherData.snow?.['3h'] || 0),
      visibility: (weatherData.visibility || 10000) / 1000,
      api_response: fullResponse
    };
  }
}

const weatherService = new WeatherService();
export default weatherService;
