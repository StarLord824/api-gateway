import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

type ErrorCode = 
  | 'BAD_REQUEST'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR'
  | 'BAD_USER_INPUT'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'USER_NOT_FOUND';

interface ErrorExtensions extends GraphQLErrorExtensions {
  code: ErrorCode;
  statusCode?: number;
  details?: Record<string, any>;
  [key: string]: any;
}

export class GraphQLErrorWithCode extends GraphQLError {
  constructor(
    message: string,
    code: ErrorCode,
    extensions?: Omit<ErrorExtensions, 'code'>
  ) {
    super(message, {
      extensions: {
        code,
        ...extensions,
      },
    });

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, GraphQLErrorWithCode.prototype);
  }

  // Factory methods for common error types
  static badRequest(message: string, details?: Record<string, any>) {
    return new GraphQLErrorWithCode(message, 'BAD_REQUEST', {
      statusCode: 400,
      details,
    });
  }

  static unauthenticated(message = 'Unauthenticated') {
    return new GraphQLErrorWithCode(message, 'UNAUTHENTICATED', {
      statusCode: 401,
    });
  }

  static forbidden(message = 'Forbidden') {
    return new GraphQLErrorWithCode(message, 'FORBIDDEN', {
      statusCode: 403,
    });
  }

  static notFound(message: string, details?: Record<string, any>) {
    return new GraphQLErrorWithCode(message, 'NOT_FOUND', {
      statusCode: 404,
      details,
    });
  }

  static internal(message = 'Internal Server Error') {
    return new GraphQLErrorWithCode(message, 'INTERNAL_SERVER_ERROR', {
      statusCode: 500,
    });
  }

  static validation(message: string, errors: Record<string, string>) {
    return new GraphQLErrorWithCode(message, 'VALIDATION_ERROR', {
      statusCode: 400,
      details: { errors },
    });
  }
}