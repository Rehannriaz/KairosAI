import validateToken from './middlewares/authMiddleware';
import router from './routes/resumeRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';

dotenv.config();

const app: Application = express();

// cors
app.use(cors());

app.use(bodyParser.json());

app.use('/api/resumes', validateToken(), router);

export default app;
