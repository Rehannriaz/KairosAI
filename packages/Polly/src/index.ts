// Updated import
import { PORT } from './config';
import validateToken from './middlewares/authMiddleware';
import JobRoutes from './routes/jobRoutes';
import startJobScraper from './utils/crone';
import connectToDatabase from './utils/database';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// startJobScraper();
// Routes
app.use('/api/jobs', validateToken(), JobRoutes); // Use the updated UserRoutes class

export default app;
