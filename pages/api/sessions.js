import { createErrorResponse } from '../../utils/error';
import { Session, Interaction } from '../../models/index';
import dbConnect from '../../lib/dbConnect';
import { z } from 'zod';

export default async function handler(req, res) {
  const timestamp = new Date().toISOString();

  try {
    await dbConnect();

    switch (req.method) {
      case 'GET':
        return await getSession(req, res);
      case 'POST':
        return await createSession(req, res);
      case 'PUT':
        return await refreshSession(req, res);
      case 'DELETE':
        return await deleteSession(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json(createErrorResponse(
          { message: `Method ${req.method} Not Allowed` },
          'Session API'
        ));
    }
  } catch (error) {
    console.error(`[${timestamp}] Session API Error:`, error);
    return res.status(500).json(createErrorResponse(error, 'Session API'));
  }
}

async function getSession(req, res) {
  const { sessionId } = req.query;
  const timestamp = new Date().toISOString();

  try {
    if (!sessionId) {
      return res.status(400).json(createErrorResponse(
        { message: 'Session ID is required' },
        'Get Session'
      ));
    }

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json(createErrorResponse(
        { message: 'Session not found' },
        'Get Session'
      ));
    }

    if (!session.active) {
      return res.status(401).json(createErrorResponse(
        { message: 'Session is no longer active' },
        'Get Session'
      ));
    }

    return res.status(200).json(session);
  } catch (error) {
    console.error(`[${timestamp}] Get Session Error:`, error);
    return res.status(500).json(createErrorResponse(error, 'Get Session'));
  }
}

async function createSession(req, res) {
  const timestamp = new Date().toISOString();

  try {
    // Validate request body
    if (!req.body.sessionId) {
      return res.status(400).json(createErrorResponse(
        { message: 'Session ID is required' },
        'Create Session'
      ));
    }

    // Create session data
    const sessionData = {
      sessionId: req.body.sessionId,
      startTime: new Date().toISOString(),
      active: true
    };
    
    // Add userId if provided
    if (req.body.userId) {
      sessionData.userId = req.body.userId;
    }
    
    // Check if session already exists
    let session = await Session.findOne({ sessionId: sessionData.sessionId });
    
    if (session) {
      // Update existing session
      session.active = true;
      if (sessionData.userId) {
        session.userId = sessionData.userId;
      }
      await session.save();
    } else {
      // Create new session
      session = await Session.create(sessionData);
    }

    // Log the operation
    console.log(`[${timestamp}] Session ${session.sessionId} ${session.userId ? 'updated' : 'created'} successfully.`);

    return res.status(201).json({
      success: true,
      data: session,
      timestamp
    });
  } catch (error) {
    console.error(`[${timestamp}] Create Session Error:`, error);
    return res.status(500).json(createErrorResponse(error, 'Create Session'));
  }
}

async function refreshSession(req, res) {
  const { sessionId } = req.query;
  const timestamp = new Date().toISOString();

  try {
    if (!sessionId) {
      return res.status(400).json(createErrorResponse(
        { message: 'Session ID is required' },
        'Refresh Session'
      ));
    }

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json(createErrorResponse(
        { message: 'Session not found' },
        'Refresh Session'
      ));
    }

    session.active = true;
    session.save();

    return res.status(200).json(session);
  } catch (error) {
    console.error(`[${timestamp}] Refresh Session Error:`, error);
    return res.status(500).json(createErrorResponse(error, 'Refresh Session'));
  }
}

async function deleteSession(req, res) {
  const { sessionId } = req.query;
  const timestamp = new Date().toISOString();

  try {
    if (!sessionId) {
      return res.status(400).json(createErrorResponse(
        { message: 'Session ID is required' },
        'Delete Session'
      ));
    }

    const result = await Session.deleteOne({ sessionId });
    if (result.deletedCount === 0) {
      return res.status(404).json(createErrorResponse(
        { message: 'Session not found' },
        'Delete Session'
      ));
    }

    return res.status(200).json({ success: true, timestamp });
  } catch (error) {
    console.error(`[${timestamp}] Delete Session Error:`, error);
    return res.status(500).json(createErrorResponse(error, 'Delete Session'));
  }
}


// Schema for session creation/update
const sessionSchema = z.object({
  sessionId: z.string().min(1),
  userAgent: z.string().optional(),
  userId: z.string().optional()
});


