import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DatabaseError, DatabaseErrorType } from '../errors/DatabaseError';

/**
 * Types of errors that the API error handler can process
 */
export enum APIErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  DATABASE = 'DATABASE_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

/**
 * Custom API error class
 */
export class APIError extends Error {
  /** Type of API error */
  type: APIErrorType;
  
  /** HTTP status code */
  statusCode: number;
  
  /** Additional error details */
  details?: Record<string, unknown>;
  
  /** Original error that caused this error */
  cause?: Error | unknown;

  constructor({
    message,
    type = APIErrorType.UNKNOWN,
    statusCode = 500,
    details,
    cause
  }: {
    message: string;
    type?: APIErrorType;
    statusCode?: number;
    details?: Record<string, unknown>;
    cause?: Error | unknown;
  }) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.cause = cause;
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, APIError.prototype);
  }

  /**
   * Convert DatabaseError to APIError
   */
  static fromDatabaseError(dbError: DatabaseError): APIError {
    // Map database error types to API error types
    let apiErrorType: APIErrorType;
    switch(dbError.type) {
      case DatabaseErrorType.VALIDATION:
        apiErrorType = APIErrorType.VALIDATION;
        break;
      case DatabaseErrorType.NOT_FOUND:
        apiErrorType = APIErrorType.NOT_FOUND;
        break;
      case DatabaseErrorType.CONNECTION:
      case DatabaseErrorType.OPERATION:
      case DatabaseErrorType.UNKNOWN:
      default:
        apiErrorType = APIErrorType.DATABASE;
        break;
    }

    return new APIError({
      message: dbError.message,
      type: apiErrorType,
      statusCode: dbError.statusCode,
      details: dbError.metadata,
      cause: dbError
    });
  }

  /**
   * Convert Zod validation error to APIError
   */
  static fromZodError(zodError: z.ZodError): APIError {
    // Format validation errors
    const formattedErrors: Record<string, string[]> = {};
    
    for (const issue of zodError.errors) {
      const path = issue.path.join('.') || 'general';
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(issue.message);
    }

    return new APIError({
      message: 'Validation failed',
      type: APIErrorType.VALIDATION,
      statusCode: 400,
      details: { errors: formattedErrors },
      cause: zodError
    });
  }

  /**
   * Create a general API error
   */
  static create({
    message,
    type = APIErrorType.UNKNOWN,
    statusCode = 500,
    details,
    cause
  }: {
    message: string;
    type?: APIErrorType;
    statusCode?: number;
    details?: Record<string, unknown>;
    cause?: Error | unknown;
  }): APIError {
    return new APIError({ message, type, statusCode, details, cause });
  }

  /**
   * Create a not found error
   */
  static notFound(resource: string, id?: string): APIError {
    return new APIError({
      message: `${resource} not found${id ? `: ${id}` : ''}`,
      type: APIErrorType.NOT_FOUND,
      statusCode: 404,
      details: id ? { id } : undefined
    });
  }

  /**
   * Create an authentication error
   */
  static unauthorized(message = 'Authentication required'): APIError {
    return new APIError({
      message,
      type: APIErrorType.AUTHENTICATION,
      statusCode: 401
    });
  }

  /**
   * Create an authorization error
   */
  static forbidden(message = 'Insufficient permissions'): APIError {
    return new APIError({
      message,
      type: APIErrorType.AUTHORIZATION,
      statusCode: 403
    });
  }

  /**
   * Create a method not allowed error
   */
  static methodNotAllowed(allowedMethods: string[]): APIError {
    return new APIError({
      message: `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
      type: APIErrorType.METHOD_NOT_ALLOWED,
      statusCode: 405,
      details: { allowedMethods }
    });
  }

  /**
   * Convert to JSON representation for API responses
   */
  toJSON(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      success: false,
      error: {
        type: this.type,
        message: this.message
      }
    };

    // Add details if available
    if (this.details && Object.keys(this.details).length > 0) {
       result.error = {
         ...(typeof result.error === 'object' && result.error !== null ? result.error : {}),
         ...this.details
       };
    }

    // In development, include the stack trace
    if (process.env.NODE_ENV === 'development') {
      result.error = {
        ...(typeof result.error === 'object' && result.error !== null ? result.error : {}),
        stack: this.stack
      };

      // Include original error information if available
      if (this.cause instanceof Error) {
        result.error = {
          ...(typeof result.error === 'object' && result.error !== null ? result.error : {}),
          cause: {
            name: this.cause.name,
            message: this.cause.message,
            stack: this.cause.stack
          }
        };
      }
    }

    return result;
  }
}

/**
 * Type for the handler function used with withErrorHandler
 */
export type APIRouteHandler = (
  req: NextRequest,
  params?: any
) => Promise<NextResponse> | NextResponse;

/**
 * Error handler middleware for API routes
 * Wrap your API route handler with this function to get consistent error handling
 */
export function withErrorHandler(handler: APIRouteHandler): APIRouteHandler {
  return async (req: NextRequest, params?: any) => {
    try {
      // Execute the original handler
      return await handler(req, params);
    } catch (error) {
      // Log the error
      console.error('API Error:', error);
      
      let apiError: APIError;
      
      // Convert different error types to APIError
      if (error instanceof DatabaseError) {
        apiError = APIError.fromDatabaseError(error);
      } else if (error instanceof z.ZodError) {
        apiError = APIError.fromZodError(error);
      } else if (error instanceof APIError) {
        apiError = error;
      } else {
        // Handle unknown errors
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        apiError = APIError.create({
          message,
          type: APIErrorType.UNKNOWN,
          statusCode: 500,
          cause: error
        });
      }
      
      // Return structured error response
      return NextResponse.json(
        apiError.toJSON(),
        { status: apiError.statusCode }
      );
    }
  };
}

/**
 * Helper to combine multiple middleware functions
 * Usage: const handler = combineMiddleware(withErrorHandler, withAuth, withLogging)(yourHandler);
 */
export function combineMiddleware(...middlewares: Array<(handler: APIRouteHandler) => APIRouteHandler>) {
  return (handler: APIRouteHandler): APIRouteHandler => {
    return middlewares.reduceRight((nextHandler, middleware) => {
      return middleware(nextHandler);
    }, handler);
  };
}

/**
 * Helper to handle method-specific route handlers
 * Example:
 * export const GET = withErrorHandler(async (req) => { ... });
 * export const POST = withErrorHandler(async (req) => { ... });
 * 
 * Or to catch all other methods:
 * export default withMethodHandler({
 *   GET: handleGet,
 *   POST: handlePost
 * });
 */
export function withMethodHandler(
  handlers: Partial<Record<string, APIRouteHandler>>
): APIRouteHandler {
  const allowedMethods = Object.keys(handlers);
  
  return withErrorHandler(async (req: NextRequest, params?: any) => {
    const method = req.method;
    
    // Check if the method is supported
    if (!method || !handlers[method]) {
      throw APIError.methodNotAllowed(allowedMethods);
    }
    
    // Call the appropriate handler
    return handlers[method](req, params);
  });
}

