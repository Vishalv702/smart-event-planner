import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/index.js';
import {handleErrors,handleNotFound} from './middleware/errorHandler.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.render('home', {
    appName: 'Smart Event Planner API',
    version: '1.0.0',
    developer: 'Vishal Vasu',
    status: '✅ Running',
    routes: [
      { method: 'GET', path: '/events', desc: 'List all events' },
      { method: 'POST', path: '/events', desc: 'Create a new event' },
      { method: 'GET', path: '/events/:id', desc: 'Get event by ID' },
      { method: 'PUT', path: '/events/:id', desc: 'Update an event' },
      { method: 'DELETE', path: '/events/:id', desc: 'Delete an event' },
      { method: 'POST', path: '/events/:id/weather-check', desc: 'Check weather & suitability' },
      { method: 'POST', path: '/auth/register', desc: 'Register user' },
      { method: 'POST', path: '/auth/login', desc: 'Login user' }
    ],
    github: 'https://github.com/Vishalv702/smart-event-planner',
    postman:'https://www.postman.com/material-administrator-52747242/workspace/weather-event-planner-apis/collection/42952734-409d7770-da68-4ed0-a77f-2797c990a5b6?action=share&creator=42952734'
  });
});

app.use('/', routes);

app.use(handleErrors);
app.use(handleNotFound);

export default app;
