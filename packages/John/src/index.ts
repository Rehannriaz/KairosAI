import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import connectToDatabase from './utils/database';
import InterviewRoutes from './routes/interview.routes'; // Updated import
import { PORT } from './config';
import validateToken from 'common/src/middlewares/authMiddleware';
dotenv.config();
const app: Application = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());
// Routes

app.use('/api/interview', validateToken(), InterviewRoutes);
// Start Server
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});
