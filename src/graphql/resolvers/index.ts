import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from './userResolver';

export const resolvers = mergeResolvers([userResolvers]);