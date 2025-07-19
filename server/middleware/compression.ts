import compression from 'compression';
import type { Express } from 'express';

// Compression middleware for better performance
export function setupCompression(app: Express) {
  app.use(compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6, // Balance between compression ratio and speed
    threshold: 1024, // Only compress responses > 1KB
  }));
}