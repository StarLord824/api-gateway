import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface Config {
  port: number;
  env: string;
  jwtSecret: string;
  redisUrl: string;
  databaseUrl: string;
  rateLimiting: {
    rest: {
      windowMs: number;
      max: number;
    };
    graphql: {
      windowMs: number;
      max: number;
    };
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000'),
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  databaseUrl: process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/gateway',
  rateLimiting: {
    rest: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000
    },
    graphql: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100
    }
  }
};

export default config;