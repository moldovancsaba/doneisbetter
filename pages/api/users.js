import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

// Validation schemas
const userSchema = z.object({
  username: z.string().min(1)
});

// Helper for standardized error responses
const errorResponse = (res, status, message, error = null, requestId = null) => {
  console.error(`[${new Date().toISOString()}] ${message}`, error);
  return res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    requestId
  });
};

// Helper for standardized success responses
const successResponse = (res, data, requestId = null) => {
  return res.status(200).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId
  });
};

export default async function handler(req, res) {
  // Generate request ID for tracing
  const requestId = uuidv4();
  console.log(`[${new Date().toISOString()}] Processing ${req.method} /api/users request ${requestId}`);

  try {
    await dbConnect();
  } catch (error) {
    return errorResponse(
      res,
      500,
      'Database connection failed',
      error,
      requestId
    );
  }

  // Health check endpoint
  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  // GET - List all users
  if (req.method === 'GET') {
    try {
      const users = await User.find({}).sort({ createdAt: -1 });
      return successResponse(res, { users }, requestId);
    } catch (error) {
      return errorResponse(
        res,
        500,
        'Failed to fetch users',
        error,
        requestId
      );
    }
  }

  // POST - Create new user
  if (req.method === 'POST') {
    try {
      const validatedData = userSchema.parse(req.body);
      
      // Check for existing user
      const existingUser = await User.findOne({ username: validatedData.username });
      if (existingUser) {
        return errorResponse(
          res,
          409,
          'Username already taken',
          null,
          requestId
        );
      }

      const user = await User.create(validatedData);
      return successResponse(res, { user }, requestId);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(
          res,
          400,
          'Invalid user data',
          error.errors,
          requestId
        );
      }
      return errorResponse(
        res,
        500,
        'Failed to create user',
        error,
        requestId
      );
    }
  }

  // DELETE - Remove user
  if (req.method === 'DELETE') {
    try {
      const { username } = req.body;
      if (!username) {
        return errorResponse(
          res,
          400,
          'Username is required',
          null,
          requestId
        );
      }

      const user = await User.findOneAndDelete({ username });
      if (!user) {
        return errorResponse(
          res,
          404,
          'User not found',
          null,
          requestId
        );
      }

      return successResponse(res, { user }, requestId);
    } catch (error) {
      return errorResponse(
        res,
        500,
        'Failed to delete user',
        error,
        requestId
      );
    }
  }

  return errorResponse(
    res,
    405,
    'Method not allowed',
    null,
    requestId
  );
}

