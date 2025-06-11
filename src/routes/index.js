import express from 'express';
import eventRoutes from './eventRoutes.js';
import weatherRoutes from './weatherRoutes.js';

const router = express.Router();

// Route for event-related endpoints
router.use('/events', eventRoutes);

// Route for weather-related endpoints
router.use('/weather', weatherRoutes);

export default router;
