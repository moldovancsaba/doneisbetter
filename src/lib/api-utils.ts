import { NextResponse } from 'next/server';

/**
 * Validates if a URL is accessible and returns an image
 * @param url The URL to validate
 * @returns Promise<boolean>
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType ? contentType.startsWith('image/') : false);
  } catch (error) {
    console.error('Failed to validate image URL:', error);
    return false;
  }
}

/**
 * Generic retry mechanism for API operations
 * @param operation The async operation to retry
 * @param maxRetries Maximum number of retry attempts
 * @param retryDelay Delay between retries in milliseconds
 * @returns Promise with the operation result
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}

/**
 * Creates a standardized error response
 * @param message Error message
 * @param status HTTP status code
 * @returns NextResponse with error details
 */
export function createErrorResponse(message: string, status: number = 500): NextResponse {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

/**
 * Creates a standardized success response
 * @param data Response data
 * @param status HTTP status code
 * @returns NextResponse with success data
 */
export function createSuccessResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json({
    data,
    timestamp: new Date().toISOString()
  }, { status });
}

/**
 * Handles API errors with appropriate responses
 * @param error The error to handle
 * @returns NextResponse with error details
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof Error) {
    // Handle known error types
    if (error.name === 'ValidationError') {
      return createErrorResponse(error.message, 400);
    }
    if (error.name === 'MongoError' && (error as any).code === 11000) {
      return createErrorResponse('Duplicate entry', 409);
    }
    return createErrorResponse(error.message);
  }
  
  // Handle unknown errors
  return createErrorResponse('An unexpected error occurred');
}
