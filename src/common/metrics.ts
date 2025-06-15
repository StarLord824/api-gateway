import client from 'prom-client';
import express from 'express';
import config from '../config';
import logger from './logger';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export const graphqlQueryDuration = new client.Histogram({
  name: 'graphql_query_duration_seconds',
  help: 'Duration of GraphQL queries in seconds',
  labelNames: ['operation', 'query'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export function initMetrics(app: express.Application) {
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', client.register.contentType);
      res.end(await client.register.metrics());
    } catch (err) {
      logger.error('Metrics error:', err);
      res.status(500).end();
    }
  });
}