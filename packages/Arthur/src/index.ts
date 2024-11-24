import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectToDatabase from './utils/database';
import router from './routes/resumeRoutes'; // Updated import
import { PORT } from './config';

dotenv.config();

const app: Application = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/resumes', router); // Use the updated UserRoutes class

// Start Server
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});
