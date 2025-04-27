// Updated import
import { PORT } from './config';
import validateToken from './middlewares/authMiddleware';
import router from './routes/resumeRoutes';
import connectToDatabase from './utils/database';
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

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});
