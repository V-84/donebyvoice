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

  // 404 handler for API routes
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `API endpoint ${req.method} ${req.path} does not exist`,
    });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, 'public')
      : path.resolve(__dirname, '..', 'dist', 'public');

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all non-API routes
  // This must be AFTER API routes
  app.get('*', (_req, res) => {
    const indexPath = path.join(staticPath, 'index.html');

    // Check if index.html exists (for development before building)
    if (require('fs').existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      // Development mode - frontend not built yet
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>DoneByVoice API</title>
            <style>
              body { font-family: system-ui; padding: 2rem; max-width: 600px; margin: 0 auto; }
              pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; }
              h1 { color: #10B981; }
              code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 3px; }
            </style>
          </head>
          <body>
            <h1>🚀 DoneByVoice API Server</h1>
            <p>The API server is running, but the frontend hasn't been built yet.</p>

            <h2>API Endpoints:</h2>
            <ul>
              <li><a href="/api"><code>GET /api</code></a> - API status</li>
              <li><a href="/api/health"><code>GET /api/health</code></a> - Health check</li>
              <li><code>POST /api/waitlist</code> - Join waitlist</li>
              <li><code>GET /api/waitlist?stats=global</code> - Global stats</li>
              <li><code>GET /api/referral?code=XXX&stats=true</code> - Referral stats</li>
            </ul>

            <h2>To build the frontend:</h2>
            <pre>pnpm build</pre>

            <h2>Or run frontend dev server:</h2>
            <pre>pnpm dev</pre>
          </body>
        </html>
      `);
    }
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
