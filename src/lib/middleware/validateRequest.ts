import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Type of validation errors structure
 */
export type ValidationError = {
  errors: Record<string, string[]>;
  message: string;
};

/**
 * Generic interface for Next.js route handlers with validation
 */
export type RouteHandler<T> = (
  req: NextRequest,
  data: T
) => Promise<NextResponse> | NextResponse;

/**
 * Response with validation error structure
 */
export function validationErrorResponse(
  error: z.ZodError,
  status: number = 400
): NextResponse {
  // Format the validation errors
  const errors: Record<string, string[]> = {};
  
  for (const issue of error.errors) {
    const path = issue.path.join('.') || 'general';
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  
  // Return structured error response
  return NextResponse.json(
    { 
      success: false, 
      message: 'Validation failed', 
      errors 
    },
    { status }
  );
}

/**
 * Middleware to validate incoming requests using Zod schemas
 * Works with Next.js App Router Route Handlers
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  handler: RouteHandler<T>
) {
  return async (req: NextRequest) => {
    try {
      let data: unknown;
      
      // Extract data based on request method
      if (req.method === 'GET') {
        // For GET requests, parse URL parameters
        const url = new URL(req.url);
        const params = Object.fromEntries(url.searchParams.entries());
        data = params;
      } else {
        // For other methods, parse request body
        data = await req.json().catch(() => ({}));
      }
      
      // Validate with Zod schema
      const validData = await schema.parseAsync(data);
      
      // Pass validated data to handler
      return handler(req, validData);
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        return validationErrorResponse(error);
      }
      
      // Handle other errors
      console.error('Request validation error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Internal server error during validation' 
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware for validating server action inputs
 * Designed to work with Next.js Server Actions
 */
export function validateActionInput<T>(
  schema: z.ZodSchema<T>,
  action: (data: T) => Promise<any>
) {
  return async (input: unknown): Promise<any> => {
    try {
      // Validate the input data
      const validData = await schema.parseAsync(input);
      
      // Call the action with validated data
      return await action(validData);
    } catch (error) {
      // Return structured validation errors
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};
        
        for (const issue of error.errors) {
          const path = issue.path.join('.') || 'general';
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(issue.message);
        }
        
        return { 
          success: false, 
          message: 'Validation failed', 
          errors 
        };
      }
      
      // Handle other errors
      console.error('Action validation error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      };
    }
  };
}

/**
 * Helper function to validate data directly without middleware
 */
export async function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: boolean; data?: T; errors?: Record<string, string[]>; message?: string }> {
  try {
    const validData = await schema.parseAsync(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      
      for (const issue of error.errors) {
        const path = issue.path.join('.') || 'general';
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      }
      
      return { 
        success: false, 
        message: 'Validation failed', 
        errors 
      };
    }
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Validation error' 
    };
  }
}

