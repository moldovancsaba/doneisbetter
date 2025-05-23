import dbConnect from '../../lib/db';
import User from '../../models/User';
import { z } from 'zod';

// Define a schema for user creation/retrieval
const userSchema = z.object({
  username: z.string().min(1).max(30).trim()
});

export default async function handler(req, res) {
  const { method } = req;

  // Connect to database
  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        // Validate request body
        const validatedData = userSchema.parse(req.body);
        const { username } = validatedData;
        
        // Check if user already exists
        let user = await User.findOne({ username });
        
        // If user doesn't exist, create a new one
        if (!user) {
          user = await User.create({ username });
        }
        
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({ success: false, error: error.errors });
        } else if (error.code === 11000) {
          // Handle duplicate key error (though this shouldn't happen with our logic)
          res.status(409).json({ success: false, error: 'Username already exists' });
        } else {
          console.error('POST user error:', error);
          res.status(500).json({ success: false, error: 'Server error' });
        }
      }
      break;
      
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }
}

