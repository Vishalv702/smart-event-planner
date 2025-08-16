import express from 'express';
import {getWeatherData,getEventSuitability,getEventAlternatives} from '../controllers/weatherController.js';

const router = express.Router();

// Get weather data for a specific location and date
router.get('/:location/:date', getWeatherData);

// Get event suitability based on weather
router.get('/event/:id/suitability', getEventSuitability);

// Get better alternative dates based on suitability
router.get('/event/:id/alternatives', getEventAlternatives);

export default router;
