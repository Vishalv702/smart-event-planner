import { EVENT_REQUIREMENTS, SUITABILITY_RATINGS } from "../config/constant.js";

class SuitabilityService {

  calculateSuitabilityScore(weatherData, eventType) {
    const requirements =
      EVENT_REQUIREMENTS[eventType] || EVENT_REQUIREMENTS.default;

    // Indoor events are unaffected by weather — short-circuit immediately.
    if (requirements.indoor) {
      return {
        score: 100,
        rating: "Excellent",
        factors: [],
        recommendation: "Indoor event — weather impact minimal",
      };
    }

    const factors = [];
    const weights = requirements.weights;

    const tempScore = this.checkTemperature(
      weatherData.temperature,
      requirements,
      factors,
    );

    const windScore = this.checkWind(
      weatherData.wind_speed,
      requirements,
      factors,
    );

    const precipitationScore = this.checkPrecipitation(
      weatherData.precipitation,
      requirements,
      factors,
    );

    const visibilityScore = this.checkVisibility(
      weatherData.visibility,
      requirements,
      factors,
    );

    const finalScore =
      tempScore * weights.temp +
      windScore * weights.wind +
      precipitationScore * weights.precipitation +
      visibilityScore * weights.visibility; 

    const score = Math.max(0, Math.round(finalScore));
    const rating = this.getRating(score);

    return {
      score,
      rating,
      factors,
      recommendation: this.getRecommendation(rating),
    };
  }

  // ─── TEMPERATURE ────────────────────────────────────────────────────────────

  checkTemperature(temp, requirements, factors) {
    const [minTemp, maxTemp] = requirements.ideal_temp;

    if (temp >= minTemp && temp <= maxTemp) return 100;

    const deviation = temp < minTemp ? minTemp - temp : temp - maxTemp;

    factors.push(
      `Temperature (${temp}°C) outside ideal range (${minTemp}–${maxTemp}°C)`,
    );

    return Math.max(0, 100 - deviation * 5);
  }

  // ─── WIND ───────────────────────────────────────────────────────────────────

  checkWind(windSpeed, requirements, factors) {
    if (requirements.wind_is_positive) {
      // More wind = better, but clamp at 100
      return Math.min(100, 50 + windSpeed);
    }

    if (windSpeed <= requirements.max_wind) return 100;

    const excess = windSpeed - requirements.max_wind;

    factors.push(
      `High wind speed (${windSpeed.toFixed(1)} km/h, limit ${requirements.max_wind} km/h)`,
    );

    return Math.max(0, 100 - excess * 3);
  }

  // ─── PRECIPITATION ──────────────────────────────────────────────────────────

  checkPrecipitation(precipitation, requirements, factors) {
    if (precipitation <= requirements.max_precipitation) return 100;

    const excess = precipitation - requirements.max_precipitation;

    factors.push(
      `Precipitation (${precipitation} mm) exceeds limit (${requirements.max_precipitation} mm)`,
    );

    return Math.max(0, 100 - excess * 15);
  }

  // ─── VISIBILITY ─────────────────────────────────────────────────────────────

  checkVisibility(visibility, requirements, factors) {
    if (visibility >= requirements.min_visibility) return 100;

    const shortage = requirements.min_visibility - visibility;

    factors.push(
      `Low visibility (${visibility} km, need ≥${requirements.min_visibility} km)`,
    );

    return Math.max(0, 100 - shortage * 10);
  }

  // ─── RATINGS / RECOMMENDATIONS ──────────────────────────────────────────────

  getRating(score) {
    if (score >= SUITABILITY_RATINGS.EXCELLENT.min)
      return SUITABILITY_RATINGS.EXCELLENT.label;
    if (score >= SUITABILITY_RATINGS.GOOD.min)
      return SUITABILITY_RATINGS.GOOD.label;
    if (score >= SUITABILITY_RATINGS.OKAY.min)
      return SUITABILITY_RATINGS.OKAY.label;
    if (score >= SUITABILITY_RATINGS.POOR.min)
      return SUITABILITY_RATINGS.POOR.label;
    return SUITABILITY_RATINGS.CRITICAL.label;
  }

  getRecommendation(rating) {
    const map = {
      Excellent: "Excellent weather conditions for your event!",
      Good: "Good weather conditions — enjoy your event.",
      Okay: "Acceptable conditions, but plan for some discomfort.",
      Poor: "Weather conditions are not ideal — consider contingency plans.",
      Critical: "Severe weather risk — rescheduling is strongly recommended.",
    };
    return map[rating] ?? "Weather conditions evaluated.";
  }
}

const suitabilityService = new SuitabilityService();
export default suitabilityService;
