import authRoutes from './routes/authRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);

export default app;
