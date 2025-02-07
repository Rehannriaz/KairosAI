import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectToDatabase from './utils/database';
import router from './routes/resumeRoutes'; // Updated import
import { PORT } from './config';
import cors from 'cors';
import validateToken from 'common/src/middlewares/authMiddleware';

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
