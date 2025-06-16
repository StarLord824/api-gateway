import { getsUserById, createsUser, authenticateUser } from '../../services/userService';
import logger from '../../common/logger';
import { GraphQLErrorWithCode } from '../error';

export const userResolvers = {
  Query: {
    async getUser(_: any, { id }: { id: string }, context: any) {
      try {
        return await getsUserById(id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error(`GraphQL getUser error: ${errorMessage}`);
        throw new GraphQLErrorWithCode(
          errorMessage,
          'USER_NOT_FOUND',
          { statusCode: 404 }
        );
      }
    },
    async getCurrentUser(_: any, __: any, context: any) {
      if (!context.user) {
        throw new GraphQLErrorWithCode(
          'Unauthorized',
          'UNAUTHENTICATED',
          { statusCode: 401 }
        );
      }
      try {
        return await getsUserById(context.user.id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error(`GraphQL getCurrentUser error: ${errorMessage}`);
        throw new GraphQLErrorWithCode(
          errorMessage,
          'INTERNAL_SERVER_ERROR',
          { statusCode: 500 }
        );
      }
    }
  },
  Mutation: {
    async createUser(_: any, { input }: any) {
      try {
        return await createsUser(input.email, input.password);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error(`GraphQL createUser error: ${errorMessage}`);
        throw new GraphQLErrorWithCode(
          errorMessage,
          'BAD_USER_INPUT',
          { statusCode: 400 }
        );
      }
    },
    async login(_: any, { input }: any, context: any) {
      try {
        const token = await authenticateUser(input.email, input.password);
        const user = await getsUserById(context.user.id);
        return { token, user };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error(`GraphQL login error: ${errorMessage}`);
        throw new GraphQLErrorWithCode(
          'Invalid credentials',
          'UNAUTHENTICATED',
          { statusCode: 401 }
        );
      }
    }
  }
};