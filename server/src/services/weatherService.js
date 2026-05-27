import axios from "axios";
import { weatherConfig } from "../config/weather.js";
import { Weather } from "../models/index.js";
import { normalizeLocation } from "../utils/helpers.js";
import { OPENWEATHER_API_KEY } from "../server.js";

class WeatherService {
  constructor() {
    // In-memory cache (1st layer)
    this.memoryCache = new Map();
    
    // Cache statistics
    this.cacheStats = {
      memoryHits: 0,
      dbHits: 0,
      apiCalls: 0,
      lastReset: new Date()
    };
  }

  // ========================
  // Public Methods
  // ========================

  async fetchWeatherData(location, date) {
    try {
      const normalizedLocation = normalizeLocation(location);
      const cacheKey = this.generateCacheKey(normalizedLocation, date);

      // 1. Check Memory Cache
      const memoryCached = this.checkMemoryCache(cacheKey);
      if (memoryCached) {
        console.log(`🌤️ Memory cache hit for ${location} on ${date}`);
        return this.formatResponse(memoryCached);
      }

      // 2. Check Database Cache
      const dbCached = await this.checkDBCache(normalizedLocation, date);
      
      if (dbCached) {
        console.log(`🌤️ DB cache hit for ${location} on ${date}`);
        this.updateMemoryCache(cacheKey, dbCached);
        return this.formatResponse(dbCached);
      }

      // 3. Call Weather API
      console.log(`🌤️ No cache found, fetching fresh data for ${location} on ${date}`);
      const freshData = await this.fetchFromAPI(location, date, normalizedLocation);
      await this.saveToDB(normalizedLocation, date, freshData);
      this.updateMemoryCache(cacheKey, freshData);
      return this.formatResponse(freshData, true);

    } catch (error) {
      console.error("Weather fetch error:", error);
      throw new Error(`Weather fetch failed: ${error.message}`);
    }
  }

  async getHourlyForecast(lat, lon, date) {
    try {
      const response = await axios.get(`${weatherConfig.BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      });

      const targetDate = new Date(date).toISOString().split("T")[0];
      return response.data.list
        .filter((entry) => entry.dt_txt.startsWith(targetDate))
        .map((entry) => ({
          time: entry.dt_txt,
          temperature: entry.main.temp,
          feels_like: entry.main.feels_like,
          weather: entry.weather[0].description,
          wind_speed: entry.wind.speed,
          precipitation: entry.rain?.["3h"] || entry.snow?.["3h"] || 0,
        }));
    } catch (error) {
      throw new Error(`Failed to fetch hourly forecast: ${error.message}`);
    }
  }

  getCacheStatistics() {
    return {
      ...this.cacheStats,
      memoryCacheSize: this.memoryCache.size,
      uptime: process.uptime()
    };
  }


  // ========================
  // Private Methods
  // ========================

  async fetchFromAPI(location, date, normalizedLocation) {
    this.cacheStats.apiCalls++;
    console.log(`🌤️ Fetching fresh weather data for ${location} on ${date}`);

    const coords = await this.getCoordinates(normalizedLocation);
    const weatherData = await this.getWeatherByDate(coords, date);
    
    if (weatherData.tooFar) {
      throw new Error("Forecast unavailable for this date");
    }
    return this.normalizeWeatherData(
      location,
      normalizedLocation,
      date,
      coords,
      weatherData.data,
      weatherData.fullResponse
    );
  }

  async getCoordinates(location) {
    try {
      const response = await axios.get(
        `${weatherConfig.GEO_URL}/direct?q=${encodeURIComponent(location)}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!response.data?.length) {
        throw new Error("Location not found");
      }

      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        name: response.data[0].name,
        country: response.data[0].country,
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      throw new Error(`Failed to get coordinates: ${error.message}`);
    }
  }

  async getWeatherByDate(coords, date) {
    const targetDate = new Date(date);
    const now = new Date();
    const daysDiff = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));

    try {
      if (daysDiff <= 0) {
        // Current weather
        const response = await axios.get(
          `${weatherConfig.BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        return {
          data: response.data,
          fullResponse: response.data,
          fullList: null,
          tooFar: false,
        };
      } else if (daysDiff <= weatherConfig.FORECAST_LIMIT_DAYS) {
        // Forecast
        const response = await axios.get(
          `${weatherConfig.BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        
        const closestForecast = this.findClosestForecast(response.data.list, targetDate);
        
        return {
          data: {
            main: closestForecast.main,
            weather: closestForecast.weather,
            wind: closestForecast.wind,
            visibility: closestForecast.visibility || 10000,
            rain: closestForecast.rain,
            snow: closestForecast.snow,
          },
          fullResponse: {
            forecast: closestForecast,
            full_response: response.data,
          },
          fullList: response.data.list,
          tooFar: false,
        };
      } else {
        return {
          data: null,
          fullResponse: null,
          fullList: null,
          tooFar: true,
        };
      }
    } catch (error) {
      console.error("Weather API error:", error);
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

  // ========================
  // Caching Methods
  // ========================

  checkMemoryCache(cacheKey) {
    const cached = this.memoryCache.get(cacheKey);
    if (cached && !this.isCacheExpired(cached)) {
      this.cacheStats.memoryHits++;
      return cached.data;
    }
    return null;
  }

 async checkDBCache(normalizedLocation, date) {
  const now = new Date();
  const targetDate = new Date(date);
  const isHistorical = targetDate < now;

  const query = { 
    normalized_location: normalizedLocation, 
    date 
  };

  if (!isHistorical) {
    query.updated_at = { 
      $gte: new Date(now - weatherConfig.DB_CACHE_DURATION) 
    };
  }

  // Explicitly select the fields we need
  const dbCached = await Weather.findOne(query)
    .select('+fullList +api_response.list')
    .lean();

  if (dbCached) {
    this.cacheStats.dbHits++;
    
    // Reconstruct fullList if it's missing or invalid
    if (!dbCached.fullList) {
      // Try to get it from api_response if available
      dbCached.fullList = dbCached.api_response?.list || 
                         dbCached.api_response?.full_response?.list || 
                         null;
    }
    // Handle case where fullList might be stored as string
    else if (typeof dbCached.fullList === 'string') {
      try {
        dbCached.fullList = JSON.parse(dbCached.fullList);
      } catch {
        dbCached.fullList = null;
      }
    }

    return dbCached;
  }
  return null;
}

async saveToDB(normalizedLocation, date, data) {
  try {
    // Create a clean data object with explicit fullList handling
    const dbData = {
      ...data,
      // Ensure fullList is properly set
      fullList: data.fullList || null,
      updated_at: new Date()
    };
    await Weather.findOneAndUpdate(
      { normalized_location: normalizedLocation, date },
      { 
        $set: dbData,
        $setOnInsert: { 
          created_at: new Date() 
        }
      },
      { 
        upsert: true,
        // Return the document after update for verification
        new: true  
      }
    );
  } catch (error) {
    console.error("DB save error:", error);
  }
}

  updateMemoryCache(cacheKey, data) {
    this.memoryCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    // Prevent memory leaks
    if (this.memoryCache.size > weatherConfig.MAX_MEMORY_CACHE_ENTRIES) {
      this.clearExpiredMemoryCache();
    }
  }

  // ========================
  // Utility Methods
  // ========================

  isCacheExpired(cacheEntry) {
    const now = Date.now();
    return (now - cacheEntry.timestamp) > weatherConfig.MEMORY_CACHE_DURATION;
  }

  clearExpiredMemoryCache() {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isCacheExpired(entry)) {
        this.memoryCache.delete(key);
      }
    }
  }

  generateCacheKey(normalizedLocation, date) {
    return `${normalizedLocation}-${new Date(date).toISOString()}`;
  }

  formatResponse(data, includeFullList = false) {
    return {
      ...data,
      tooFar: false,
      ...(includeFullList && { fullList: data.fullList })
    };
  }

  findClosestForecast(forecastList, targetDate) {
    const targetTimestamp = targetDate.getTime();
    let closestForecast = forecastList[0];
    let minDiff = Math.abs(new Date(closestForecast.dt * 1000) - targetTimestamp);

    forecastList.forEach((forecast) => {
      const diff = Math.abs(new Date(forecast.dt * 1000) - targetTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closestForecast = forecast;
      }
    });

    return closestForecast;
  }

  normalizeWeatherData(location, normalizedLocation, date, coords, weatherData, fullResponse) {
    const fullList = fullResponse?.list || 
                 fullResponse?.full_response?.list || 
                 null;

    return {
      location,
      normalized_location: normalizedLocation,
      date,
      coordinates: coords,
      temperature: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      weather_main: weatherData.weather[0].main,
      weather_description: weatherData.weather[0].description,
      wind_speed: weatherData.wind.speed * 3.6,
      wind_direction: weatherData.wind.deg || 0,
      precipitation: weatherData.rain?.["3h"] || weatherData.snow?.["3h"] || 0,
      visibility: (weatherData.visibility || 10000) / 1000,
      api_response: fullResponse,
       fullList: fullList
    };
  }
}

const weatherService = new WeatherService();
export default weatherService;