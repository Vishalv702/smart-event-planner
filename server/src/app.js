import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';


import routes from './routes/index.js';
import {handleErrors,handleNotFound} from './middleware/errorHandler.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(cors({
   origin: [
    "http://localhost:5173",        
    "https://smarteventplanner.netlify.app" 
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api', routes);

app.use(handleErrors);
app.use(handleNotFound);

export default app;
