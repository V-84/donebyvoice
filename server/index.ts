import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { errorHandler } from './middleware/errorHandler.js';
import referralRouter from './routes/referral.js';
import waitlistRouter from './routes/waitlist.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/waitlist', waitlistRouter);
  app.use('/api/referral', referralRouter);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API root endpoint
  app.get('/api', (_req, res) => {
    res.json({ message: 'doneByVoice API up' });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, 'public')
      : path.resolve(__dirname, '..', 'dist', 'public');

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  // This must be AFTER API routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`API available at http://localhost:${port}/api`);
  });
}

startServer().catch(console.error);
