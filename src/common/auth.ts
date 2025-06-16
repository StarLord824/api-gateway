import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { GraphQLContext } from '../graphql/context';
import logger from './logger';
import { JwtUser } from './types';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    logger.warn('No authorization header provided');
    res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader?.split(' ')[1];
  
  try {
    if (!token) {
      throw new Error('Invalid token');
    }
    const user = jwt.verify(token, config.jwtSecret);
    (req as any).user = user;
    next();
  } catch (err) {
    logger.error('JWT verification failed:', err);
    res.status(403).json({ error: 'Forbidden' });
  }
}

export function createGraphQLContext({ req }: { req: Request }): GraphQLContext {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1] || '';
  
  try {
    const user = token ? jwt.verify(token, config.jwtSecret) as JwtUser : undefined;
    return { user };
  } catch (err) {
    logger.error('GraphQL context creation failed:', err);
    return { user: undefined };
  }
}