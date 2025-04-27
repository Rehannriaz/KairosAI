// /api/index.ts

import app from '../src/index';
import connectToDatabase from '../src/utils/database';
import { createServer } from 'http';
import { Server } from 'http';

let server: Server;

export default async function handler(req: any, res: any) {
  if (!server) {
    await connectToDatabase();
    server = createServer(app);
  }

  server.emit('request', req, res);
}
