import express from 'express';
import router from './router';
import { authenticateJWT } from '../common/auth';
import { restRateLimit } from '../common/rateLimiter';
import { initCache } from '../common/cache';
import logger from '../common/logger';

const restApp = express();

// Initialize cache
initCache();

// Apply middlewares
restApp.use(express.json());
restApp.use(authenticateJWT);
restApp.use(restRateLimit);

// Apply router
restApp.use('/api', router);

// Error handling
restApp.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('REST API error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default restApp;