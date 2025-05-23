import { z } from 'zod';
import dbConnect from '../../lib/db';
import Interaction from '../../models/Interaction';
import User from '../../models/User';

const interactionSchema = z.object({
  userId: z.string(),
  cardId: z.string(),
  type: z.enum(['swipe', 'vote']),
  action: z.enum(['left', 'right', 'up', 'down'])
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const validation = interactionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request data',
        details: validation.error.issues 
      });
    }

    const { userId, cardId, type, action } = validation.data;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Create interaction
    const interaction = await Interaction.create({
      userId,
      cardId,
      type,
      action
    });

    return res.status(201).json({ success: true, data: interaction });
  } catch (error) {
    console.error('Error in interaction handler:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

