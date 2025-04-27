// Updated import
import { PORT } from './config';
import validateToken from './middlewares/authMiddleware';
import InterviewRoutes from './routes/interview.routes';
// Import the cors package
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
// Routes

app.use('/api/interview', validateToken(), InterviewRoutes);

export default app;
