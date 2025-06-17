import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import {handleErrors,handleNotFound} from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.use(handleErrors);
app.use(handleNotFound);

export default app;
