import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import Redis from 'ioredis';

/**
 * Core API Response Type
 */
export interface JwtUser {
  id: string;
  email: string;
}
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

/**
 * JWT Payload Type
 */
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Authenticated Request Extension
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
}

/**
 * Service Response Type
 */
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Rate Limit Configuration
 */
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  statusCode?: number;
}

/**
 * GraphQL Context Type
 */
export interface GraphQLContext {
  req: Request;
  res: Response;
  user?: JwtPayload;
  prisma: PrismaClient;
  redis: Redis;
}

/**
 * Cache Options
 */
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string;
}

/**
 * Error Response Type
 */
export interface ErrorResponse {
  statusCode: number;
  message: string;
  code?: string;
  timestamp?: string;
  path?: string;
  stack?: string;
}

/**
 * API Documentation Types
 */
export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  responses: {
    status: number;
    description: string;
    schema?: any;
  }[];
}

/**
 * Health Check Response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  details: {
    database: boolean;
    redis: boolean;
    memoryUsage: number;
    uptime: number;
    timestamp: string;
  };
  services?: {
    name: string;
    status: 'up' | 'down';
    responseTime: number;
  }[];
}