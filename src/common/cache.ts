import Redis from 'ioredis';
import config from '../config';
import logger from './logger';

let redisClient: Redis;

export function initCache() {
  redisClient = new Redis(config.redisUrl);
  
  redisClient.on('error', (err) => {
    logger.error('Redis cache error:', err);
  });
}

export async function getFromCache(key: string): Promise<any> {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error('Cache get error:', err);
    return null;
  }
}

export async function setInCache(key: string, value: any, ttl?: number): Promise<void> {
  try {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redisClient.setex(key, ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
  } catch (err) {
    logger.error('Cache set error:', err);
  }
}