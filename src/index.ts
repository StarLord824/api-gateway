import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import restApp from './rest';
import graphqlServer from './graphql';
import config from './config';
import { initMetrics } from './common/metrics';
import logger from './common/logger';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  // Initialize shared components
  await initMetrics(app);
  logger.info('Initialized shared components');

  // Apply common middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize REST API
  app.use('/api', restApp);
  logger.info('REST API initialized');

  // Initialize GraphQL API
  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app, path: '/graphql' });
  logger.info('GraphQL API initialized');

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  httpServer.listen(config.port, () => {
    logger.info(`🚀 Gateway running on port ${config.port}`);
    logger.info(`REST API: http://localhost:${config.port}/api`);
    logger.info(`GraphQL: http://localhost:${config.port}/graphql`);
  });

  return { app, server: httpServer };
}

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});