import mongoose from 'mongoose';

export const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
/**
 * Normalize a location string (trim, lowercase, single space)
 */
export const normalizeLocation = (location) => {
  return location.toLowerCase().trim().replace(/\s+/g, ' ');
};

/**
 * Calculate event suitability score based on weather and event type
 */
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
