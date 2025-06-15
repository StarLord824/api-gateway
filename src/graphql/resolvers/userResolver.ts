import { getUserById, createUser, authenticateUser } from '../../services/userService';
import { JwtUser } from '../../common/types';
import logger from '../../common/logger';
import { ApolloError } from 'apollo-server-express';

export const userResolvers = {
  Query: {
    async getUser(_: any, { id }: { id: string }, context: any) {
      try {
        return await getUserById(id);
      } catch (err) {
        logger.error(`GraphQL getUser error: ${err.message}`);
        throw new ApolloError(err.message, err.statusCode.toString());
      }
    },
    async getCurrentUser(_: any, __: any, context: any) {
      if (!context.user) {
        throw new ApolloError('Unauthorized', '401');
      }
      try {
        return await getUserById(context.user.id);
      } catch (err) {
        logger.error(`GraphQL getCurrentUser error: ${err.message}`);
        throw new ApolloError(err.message, err.statusCode.toString());
      }
    }
  },
  Mutation: {
    async createUser(_: any, { input }: any) {
      try {
        return await createUser(input.email, input.password);
      } catch (err) {
        logger.error(`GraphQL createUser error: ${err.message}`);
        throw new ApolloError(err.message, err.statusCode.toString());
      }
    },
    async login(_: any, { input }: any) {
      try {
        const token = await authenticateUser(input.email, input.password);
        const user = await getUserById(context.user.id);
        return { token, user };
      } catch (err) {
        logger.error(`GraphQL login error: ${err.message}`);
        throw new ApolloError(err.message, err.statusCode.toString());
      }
    }
  }
};