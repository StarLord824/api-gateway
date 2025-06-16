import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { GraphQLError } from 'graphql';
import http from 'http';
import { createGraphQLContext } from '../common/auth';
import config from '../config';
import logger from '../common/logger';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

export async function createApolloServer(httpServer: http.Server) {
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async requestDidStart() {
          return {
            async didEncounterErrors(requestContext) {
              requestContext.errors?.forEach(error => {
                logger.error(`GraphQL Error: ${error.message}`, {
                  operationName: requestContext.operationName,
                  query: requestContext.request.query,
                  variables: requestContext.request.variables,
                  stack: error.stack
                });
              });
            },
          };
        },
      },
    ],
    formatError: (formattedError) => {
      logger.error('GraphQL Formatted Error:', formattedError);
      return {
        ...formattedError,
        extensions: {
          ...formattedError.extensions,
          code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
        },
      };
    },
  });

  await server.start();

  return expressMiddleware(server, {
    context: async ({ req }) => createGraphQLContext({ req }),
  });
}

// Error handling utility
export class GraphQLErrorWithCode extends GraphQLError {
  constructor(
    message: string,
    code: string,
    extensions?: Record<string, any>
  ) {
    super(message, {
      extensions: {
        code,
        ...extensions,
      },
    });
  }
}