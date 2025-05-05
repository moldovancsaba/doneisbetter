/**
 * Custom error types for database operations
 */
export enum DatabaseErrorType {
  CONNECTION = 'CONNECTION_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  DUPLICATE = 'DUPLICATE_ERROR',
  OPERATION = 'OPERATION_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

/**
 * A custom error class for database-related errors
 * Provides structured error information for consistent error handling
 */
export class DatabaseError extends Error {
  /** Type of database error */
  type: DatabaseErrorType;
  
  /** HTTP status code associated with this error */
  statusCode: number;
  
  /** Original error that caused this error (if any) */
  originalError?: Error | unknown;
  
  /** Additional metadata about the error */
  metadata?: Record<string, unknown>;

  constructor({
    message,
    type = DatabaseErrorType.UNKNOWN,
    statusCode = 500,
    originalError,
    metadata
  }: {
    message: string;
    type?: DatabaseErrorType;
    statusCode?: number;
    originalError?: Error | unknown;
    metadata?: Record<string, unknown>;
  }) {
    super(message);
    this.name = 'DatabaseError';
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.metadata = metadata;
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  /**
   * Parses a MongoDB/Mongoose error and returns a DatabaseError with the appropriate type
   */
  static fromMongoError(error: Error | unknown): DatabaseError {
    // Handle connection errors
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return new DatabaseError({
        message: 'Failed to connect to the database',
        type: DatabaseErrorType.CONNECTION,
        statusCode: 503,
        originalError: error
      });
    }
    
    // Handle validation errors (typically from Mongoose)
    if (error instanceof Error && error.name === 'ValidationError') {
      return new DatabaseError({
        message: 'Database validation failed',
        type: DatabaseErrorType.VALIDATION,
        statusCode: 400,
        originalError: error,
        metadata: { validationError: error.message }
      });
    }

    // Handle duplicate key errors
    if (error instanceof Error && 
        (error.message.includes('E11000') || error.message.includes('duplicate key error'))) {
      return new DatabaseError({
        message: 'Duplicate entry found',
        type: DatabaseErrorType.DUPLICATE,
        statusCode: 409,
        originalError: error
      });
    }

    // Default unknown error
    return new DatabaseError({
      message: error instanceof Error ? error.message : 'Unknown database error',
      type: DatabaseErrorType.UNKNOWN,
      statusCode: 500,
      originalError: error
    });
  }

  /**
   * Creates a NOT_FOUND error
   */
  static notFound(resource: string, id?: string): DatabaseError {
    return new DatabaseError({
      message: `${resource} not found${id ? `: ${id}` : ''}`,
      type: DatabaseErrorType.NOT_FOUND,
      statusCode: 404,
      metadata: id ? { id } : undefined
    });
  }

  /**
   * Convert the error to a JSON representation for API responses
   */
  toJSON(): Record<string, unknown> {
    return {
      error: {
        type: this.type,
        message: this.message,
        statusCode: this.statusCode,
        ...(this.metadata && { metadata: this.metadata })
      }
    };
  }
}

