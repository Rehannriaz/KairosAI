// dev.ts
import app from '.';
import { PORT } from './config';
import connectToDatabase from './utils/database';
import dotenv from 'dotenv';

dotenv.config();

async function start() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 John running on ${PORT}`);
  });
}

start();
