import { Event } from '../models/index.js';
import weatherService from '../services/weatherService.js';
import suitabilityService from '../services/suitabilityService.js';
import { validateObjectId } from '../utils/helpers.js';

class WeatherController {
  async getWeatherData(req, res) {
    try {
      const { location, date } = req.params;

      const weatherData = await weatherService.fetchWeatherData(location, date);
      
      const { _id, __v, created_at, updated_at, api_response, normalized_location, ...cleanWeatherData } = weatherData;

      res.json(cleanWeatherData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEventSuitability(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (this.hasFreshSuitabilityData(event)) {
        return res.json(this.formatSuitabilityResponse(event, true));
      }

      const weatherData = await weatherService.fetchWeatherData(event.location, event.date);
      const suitability = suitabilityService.calculateSuitabilityScore(weatherData, event.event_type);

      await this.updateEventWeatherCache(event, weatherData, suitability);

      res.json(this.formatSuitabilityResponse(event, false, weatherData, suitability));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEventAlternatives(req, res) {
    try {
      const { id } = req.params;
      const daysRange = parseInt(req.query.days) || 7;

      if (!validateObjectId(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const alternatives = await this.findAlternativeDates(event, daysRange);
      alternatives.sort((a, b) => b.suitability.score - a.suitability.score);

      const recommendation = this.getAlternativeRecommendation(alternatives);

      res.json({
        event: {
          id: event._id,
          name: event.name,
          original_date: event.date
        },
        alternatives,
        recommendation
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  hasFreshSuitabilityData(event) {
    return event.suitability && 
           event.suitability.last_calculated && 
           (new Date() - event.suitability.last_calculated) < 3600000;
  }

  formatSuitabilityResponse(event, cached, weatherData = null, suitability = null) {
    const response = {
      event_id: event._id,
      event_name: event.name,
      event_type: event.event_type,
      date: event.date,
      location: event.location,
      suitability: suitability || event.suitability,
      cached
    };

    const data = weatherData || event.weather_data;
    if (data) {
      response.weather_summary = {
        temperature: `${data.temperature}°C`,
        condition: data.weather_description,
        wind: `${data.wind_speed} m/s`,
        precipitation: `${data.precipitation}mm`
      };
    }

    return response;
  }

  async updateEventWeatherCache(event, weatherData, suitability) {
    event.weather_data = {
      temperature: weatherData.temperature,
      feels_like: weatherData.feels_like,
      humidity: weatherData.humidity,
      pressure: weatherData.pressure,
      weather_main: weatherData.weather_main,
      weather_description: weatherData.weather_description,
      wind_speed: weatherData.wind_speed,
      wind_direction: weatherData.wind_direction,
      precipitation: weatherData.precipitation,
      visibility: weatherData.visibility,
      last_updated: new Date()
    };

    event.suitability = {
      score: suitability.score,
      rating: suitability.rating,
      factors: suitability.factors,
      last_calculated: new Date()
    };

    await event.save();
  }

  async findAlternativeDates(event, daysRange) {
    const eventDate = new Date(event.date);
    const alternatives = [];

    for (let i = 1; i <= daysRange; i++) {
      const checkDate = new Date(eventDate);
      checkDate.setDate(eventDate.getDate() + i);

      if (checkDate > new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)) {
        break;
      }

      try {
        const weatherData = await weatherService.fetchWeatherData(event.location, checkDate.toISOString().split('T')[0]);
        const suitability = suitabilityService.calculateSuitabilityScore(weatherData, event.event_type);

        alternatives.push({
          date: checkDate.toISOString().split('T')[0],
          suitability,
          weather_summary: {
            temperature: `${weatherData.temperature}°C`,
            condition: weatherData.weather_description,
            wind: `${weatherData.wind_speed} m/s`,
            precipitation: `${weatherData.precipitation}mm`
          }
        });
      } catch (err) {
        continue;
      }
    }

    return alternatives;
  }

  getAlternativeRecommendation(alternatives) {
    if (alternatives.length === 0) return 'No better alternatives available within range.';
    const best = alternatives[0];
    return `Consider rescheduling to ${best.date} for better suitability: ${best.suitability.rating}`;
  }
}

const controller = new WeatherController();

export const getWeatherData = controller.getWeatherData.bind(controller);
export const getEventSuitability = controller.getEventSuitability.bind(controller);
export const getEventAlternatives = controller.getEventAlternatives.bind(controller);
export default controller;