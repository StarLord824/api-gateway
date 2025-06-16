import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import config from '../config';
import logger from './logger';
import { Request, Response, NextFunction } from 'express';

const redisClient = new Redis(config.redisUrl);

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

const restRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rest_limiter',
  points: config.rateLimiting.rest.max,
  duration: config.rateLimiting.rest.windowMs / 1000,
});

const graphqlRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'graphql_limiter',
  points: config.rateLimiting.graphql.max,
  duration: config.rateLimiting.graphql.windowMs / 1000,
});

export async function restRateLimit(req: Request, res: Response, next: NextFunction) {
  try {
    await restRateLimiter.consume(req.ip || 'unknown');
    next();
  } catch (err) {
    res.status(429).json({ error: 'Too many requests' });
  }
}

export async function graphqlRateLimit(source: string) {
  try {
    await graphqlRateLimiter.consume(source);
    return true;
  } catch (err) {
    throw new Error('Too many GraphQL requests');
  }
}