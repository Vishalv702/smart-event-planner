import { Event } from '../models/index.js';
import weatherService from '../services/weatherService.js';
import suitabilityService from '../services/suitabilityService.js';
import { validateObjectId, analyzeWeatherTrend } from '../utils/helpers.js';

class EventController {
  async createEvent(req, res) {
    try {
      const { name, location, date, event_type, description } = req.body;

      const event = new Event({
        name,
        location,
        date,
        event_type,
        description: description || ''
      });

      const savedEvent = await event.save();

      res.status(201).json({
        id: savedEvent._id,
        name: savedEvent.name,
        location: savedEvent.location,
        date: savedEvent.date,
        event_type: savedEvent.event_type,
        description: savedEvent.description,
        created_at: savedEvent.createdAt,
        message: 'Event created successfully'
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getEvents(req, res) {
    try {
      const { event_type, location, limit = 50, skip = 0 } = req.query;

      const filter = {};
      if (event_type) filter.event_type = event_type;
      if (location) filter.location = new RegExp(location, 'i');

      const events = await Event.find(filter)
        .sort({ date: 1, createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .select('-api_response');

      const total = await Event.countDocuments(filter);

      res.json({
        events,
        count: events.length,
        total,
        has_more: (parseInt(skip) + events.length) < total
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEventById(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const event = await Event.findById(id).select('-api_response');

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { name, location, date, event_type, description } = req.body;

      if (!validateObjectId(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (location) updateData.location = location;
      if (date) updateData.date = date;
      if (event_type) updateData.event_type = event_type;
      if (description !== undefined) updateData.description = description;

      if (location || date) {
        updateData.weather_data = undefined;
        updateData.suitability = undefined;
      }

      const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      }).select('-api_response');

      if (!updatedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json({
        ...updatedEvent.toObject(),
        message: 'Event updated successfully'
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const deletedEvent = await Event.findByIdAndDelete(id);

      if (!deletedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async checkEventWeather(req, res) {
    try {
      const { id } = req.params;

      if (!validateObjectId(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const coords = await weatherService.getCoordinates(event.location);
      const weatherData = await weatherService.fetchWeatherData(event.location, event.date);
      const trend = weatherData.fullList ? analyzeWeatherTrend(weatherData.fullList) : null;
      const suitability = suitabilityService.calculateSuitabilityScore(weatherData, event.event_type);

      // Historical Data (last 3 weeks same day)
      const historical = [];
      for (let i = 1; i <= 3; i++) {
        const pastDate = new Date(event.date);
        pastDate.setDate(pastDate.getDate() - (7 * i));
        try {
          const pastData = await weatherService.getHistoricalWeather(coords.lat, coords.lon, pastDate);
          historical.push(pastData);
        } catch (err) {
          historical.push({
            date: pastDate.toISOString().split('T')[0],
            error: 'Historical data unavailable'
          });
        }
      }

      // Hourly Forecast
      let hourlyForecast = [];
      try {
        const eventDateObj = new Date(event.date);
        const today = new Date();
        const diffDays = (eventDateObj - today) / (1000 * 60 * 60 * 24);
        if (diffDays <= 5 && diffDays >= 0) {
          hourlyForecast = await weatherService.getHourlyForecast(coords.lat, coords.lon, event.date);
        }
      } catch (err) {
        console.warn('Hourly forecast fetch failed:', err.message);
      }

      // Save to DB
      await updateEventWeatherData(event, weatherData, suitability, {
        historical_weather: historical,
        hourly_forecast: hourlyForecast
      });

      const recommendation = suitabilityService.getRecommendation(suitability.rating);

      res.json({
        event: {
          id: event._id,
          name: event.name,
          location: event.location,
          date: event.date,
          event_type: event.event_type
        },
        weather: {
          temperature: weatherData.temperature,
          weather_description: weatherData.weather_description,
          wind_speed: weatherData.wind_speed,
          precipitation: weatherData.precipitation,
          visibility: weatherData.visibility
        },
        suitability,
        recommendation,
        historical_weather: historical,
        hourly_forecast: hourlyForecast,
        weather_trend: trend
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const updateEventWeatherData = async (event, weatherData, suitability, extra = {}) => {
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
    last_updated: new Date(),
    historical_weather: extra.historical_weather || [],
    hourly_forecast: extra.hourly_forecast || []
  };

  event.suitability = {
    score: suitability.score,
    rating: suitability.rating,
    factors: suitability.factors,
    last_calculated: new Date()
  };

  await event.save();
};

const controller = new EventController();
export default controller;
