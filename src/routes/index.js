import express from 'express';
import eventRoutes from './eventRoutes.js';
import weatherRoutes from './weatherRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/auth',authRoutes);

router.use('/events', eventRoutes);

router.use('/weather', weatherRoutes);

export default router;
