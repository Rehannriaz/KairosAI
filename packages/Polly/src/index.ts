import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectToDatabase from './utils/database';
import JobRoutes from './routes/jobRoutes'; // Updated import
import { PORT } from './config';
import validateToken from 'common/src/middlewares/authMiddleware'
dotenv.config();
import cors from 'cors';

const app: Application = express();

// Middleware
app.use(cors())
app.use(bodyParser.json());

// Routes
app.use('/api/jobs',validateToken(), JobRoutes); // Use the updated UserRoutes class

// Start Server
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});
