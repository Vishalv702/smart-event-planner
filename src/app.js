import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import {handleErrors,handleNotFound} from './middleware/errorHandler.js';



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Error handling middleware
app.use(handleErrors);

// 404 handler
app.use(handleNotFound);

export default app;
