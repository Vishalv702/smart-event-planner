import { EVENT_REQUIREMENTS, SUITABILITY_RATINGS } from '../config/constant.js';

class SuitabilityService {
  calculateSuitabilityScore(weatherData, eventType) {
    const requirements = EVENT_REQUIREMENTS[eventType] || EVENT_REQUIREMENTS.default;
    let score = 100;
    let factors = [];

    // Temperature check
    score -= this.checkTemperature(weatherData.temperature, requirements, factors);

    // Wind check
    score -= this.checkWind(weatherData.wind_speed, requirements, factors);

    // Precipitation check
    score -= this.checkPrecipitation(weatherData.precipitation, requirements, factors);

    // Visibility check
    score -= this.checkVisibility(weatherData.visibility, requirements, factors);

    score = Math.max(0, Math.round(score));
    const rating = this.getRating(score);

    return { score, rating, factors };
  }

  checkTemperature(temp, requirements, factors) {
    const [minTemp, maxTemp] = requirements.ideal_temp;

    if (temp < minTemp || temp > maxTemp) {
      const tempDeviation = Math.min(
        Math.abs(temp - minTemp),
        Math.abs(temp - maxTemp)
      );
      factors.push(`Temperature (${temp}°C) outside ideal range`);
      return Math.min(30, tempDeviation * 3);
    }
    return 0;
  }

  checkWind(windSpeed, requirements, factors) {
    if (windSpeed > requirements.max_wind) {
      factors.push(`High wind speed (${windSpeed} m/s)`);
      return Math.min(25, (windSpeed - requirements.max_wind) * 2);
    }
    return 0;
  }

  checkPrecipitation(precipitation, requirements, factors) {
    if (precipitation > requirements.max_precipitation) {
      factors.push(`Precipitation (${precipitation}mm)`);
      return Math.min(40, precipitation * 20);
    }
    return 0;
  }

  checkVisibility(visibility, requirements, factors) {
    if (visibility < requirements.min_visibility) {
      factors.push(`Low visibility (${visibility}km)`);
      return Math.min(15, (requirements.min_visibility - visibility) * 3);
    }
    return 0;
  }

  getRating(score) {
    if (score >= SUITABILITY_RATINGS.GOOD.min) return SUITABILITY_RATINGS.GOOD.label;
    if (score >= SUITABILITY_RATINGS.OKAY.min) return SUITABILITY_RATINGS.OKAY.label;
    return SUITABILITY_RATINGS.POOR.label;
  }

  getRecommendation(rating) {
    switch (rating) {
      case 'Good':
        return 'Perfect weather for your event!';
      case 'Okay':
        return 'Weather is acceptable, but consider alternatives';
      case 'Poor':
        return 'Poor weather conditions - strongly recommend rescheduling';
      default:
        return 'Weather conditions evaluated';
    }
  }
}

const suitabilityService = new SuitabilityService();
export default suitabilityService;
