import express from 'express';
import eventController from '../controllers/eventController.js';

const router = express.Router();

// Event CRUD
router.post('/', eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Weather Check + Suitability
router.post('/:id/weather-check', eventController.checkEventWeather);

export default router;
