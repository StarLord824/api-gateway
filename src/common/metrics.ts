import client from 'prom-client';
import express from 'express';
import config from '../config';
import logger from './logger';

// Create a Registry which holds the metrics
const register = new client.Registry();

// Enable the collection of default metrics
client.collectDefaultMetrics({
  register, // Explicitly specify our registry
  prefix: 'api_gateway_', // Optional prefix for metric names
  gcDurationBuckets: [0.1, 0.5, 1, 2, 5], // Optional GC metrics buckets
});

// Custom metrics
export const httpRequestDuration = new client.Histogram({
  name: 'api_gateway_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5], // Custom buckets
  registers: [register], // Add to our registry
});

export const graphqlQueryDuration = new client.Histogram({
  name: 'api_gateway_graphql_query_duration_seconds',
  help: 'Duration of GraphQL queries in seconds',
  labelNames: ['operation', 'query'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Initialize metrics endpoint
export function initMetrics(app: express.Application) {
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      logger.error('Metrics endpoint error:', err);
      res.status(500).end();
    }
  });

  logger.info('Metrics initialized');
}

// Utility function to measure request duration
export function startRequestTimer(method: string, route: string) {
  const end = httpRequestDuration.startTimer({ method, route });
  return (statusCode: number) => {
    end({ status_code: statusCode.toString() });
  };
}

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({
  register,
  labels: { app: 'api-gateway' },
  eventLoopMonitoringPrecision: 10, // in ms
});

export const redisLatency = new client.Summary({
  name: 'api_gateway_redis_latency_seconds',
  help: 'Redis command latency',
  labelNames: ['command'],
  registers: [register],
});

export const dbQueryDuration = new client.Histogram({
  name: 'api_gateway_db_query_duration_seconds',
  help: 'Database query duration',
  labelNames: ['model', 'operation'],
  registers: [register],
});