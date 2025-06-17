import express from 'express';
import eventController from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Event CRUD
router.post('/',protect, eventController.createEvent);
router.get('/', protect, eventController.getEvents);
router.get('/:id',protect, eventController.getEventById);
router.put('/:id',protect, eventController.updateEvent);
router.delete('/:id',protect, eventController.deleteEvent);

// Weather Check + Suitability
router.post('/:id/weather-check', eventController.checkEventWeather);

export default router;
