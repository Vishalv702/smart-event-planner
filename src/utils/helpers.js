import mongoose from 'mongoose';

export const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const normalizeLocation = (location) => {
  return location.toLowerCase().trim().replace(/\s+/g, ' ');
};

import { EVENT_REQUIREMENTS } from './constants.js';

export const calculateSuitabilityScore = (weatherData, eventType) => {
  const requirements = EVENT_REQUIREMENTS[eventType] || EVENT_REQUIREMENTS.default;
  let score = 100;
  let factors = [];

  // Temperature check
  const temp = weatherData.temperature;
  if (temp < requirements.ideal_temp[0] || temp > requirements.ideal_temp[1]) {
    const tempDeviation = Math.min(
      Math.abs(temp - requirements.ideal_temp[0]),
      Math.abs(temp - requirements.ideal_temp[1])
    );
    score -= Math.min(30, tempDeviation * 3);
    factors.push(`Temperature (${temp}°C) outside ideal range`);
  }

  // Wind check
  if (weatherData.wind_speed > requirements.max_wind) {
    score -= Math.min(25, (weatherData.wind_speed - requirements.max_wind) * 2);
    factors.push(`High wind speed (${weatherData.wind_speed} m/s)`);
  }

  // Precipitation check
  if (weatherData.precipitation > requirements.max_precipitation) {
    score -= Math.min(40, weatherData.precipitation * 20);
    factors.push(`Precipitation (${weatherData.precipitation}mm)`);
  }

  // Visibility check
  if (weatherData.visibility < requirements.min_visibility) {
    score -= Math.min(15, (requirements.min_visibility - weatherData.visibility) * 3);
    factors.push(`Low visibility (${weatherData.visibility}km)`);
  }

  score = Math.max(0, Math.round(score));

  let rating;
  if (score >= 80) rating = 'Good';
  else if (score >= 60) rating = 'Okay'; 
  else rating = 'Poor';

  return { score, rating, factors };
};

export const analyzeWeatherTrend = (forecastList) => {
  if (!forecastList || forecastList.length < 2) return 'Insufficient data';

  const trend = {
    temperature: [],
    precipitation: [],
    wind_speed: []
  };

  forecastList.forEach(entry => {
    trend.temperature.push(entry.main.temp);
    trend.precipitation.push(entry.rain?.['3h'] || 0);
    trend.wind_speed.push(entry.wind.speed);
  });

  const getTrendDirection = (arr) => {
    let increase = 0, decrease = 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > arr[i - 1]) increase++;
      else if (arr[i] < arr[i - 1]) decrease++;
    }
    if (increase > decrease) return 'increasing';
    if (decrease > increase) return 'decreasing';
    return 'stable';
  };

  return {
    temperature: getTrendDirection(trend.temperature),
    precipitation: getTrendDirection(trend.precipitation),
    wind: getTrendDirection(trend.wind_speed)
  };
};

